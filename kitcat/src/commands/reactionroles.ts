import {
    MessageEmbed,
    Message,
    Snowflake,
    TextChannel,
    Collection,
    MessageReaction,
    User,
    ReactionEmoji,
    GuildEmoji,
    PartialUser,
    Role,
    DiscordAPIError,
    Guild,
    PartialMessage,
} from 'discord.js';
import { Command } from '../commands';
import { UNICODE_EMOJI_REGEX, CUSTOM_EMOJI_REGEX, clamp, NOOP } from '../util/utils';
import { userBypass } from '../util/utils';
import { db } from '../db';
import NodeCache from 'node-cache';

const guildSelfRolesCache = new NodeCache();

export type IGuildSelfRoles = Record<string, Record<string, string>>;

export function getGuildReactionRoles(guild: Guild): IGuildSelfRoles {
    const { id } = guild;
    if (guildSelfRolesCache.has(id)) return guildSelfRolesCache.get(id);
    const rows = db.prepare('SELECT message, roles FROM "reaction_roles" WHERE guild = ?').all(id);
    const selfRoles: IGuildSelfRoles = {};
    rows.forEach((row) => (selfRoles[row.message] = JSON.parse(row.roles)));
    guildSelfRolesCache.set(id, selfRoles, guild.memberCount > 10000 ? 60 * 60 * 4 : 60 * 60);
    return selfRoles;
}

export function addReactionRolesToDB(message: Message, roles: Record<string, Snowflake>): void {
    db.prepare('INSERT OR IGNORE INTO "reaction_roles" (message, guild, roles, channel) VALUES (?, ?, ?, ?)').run(
        message.id,
        message.guild.id,
        JSON.stringify(roles),
        message.channel.id
    );
    guildSelfRolesCache.del(message.guild.id);
}

export default class Roles extends Command {
    executor = 'reactionroles';
    category = 'moderation';
    display_name = 'Reaction Roles';
    description = `Make a message that when reacted to, assigns you a role.`;
    usage = '';
    guildOnly = true;
    unlisted = false;
    nsfw = false;

    run(message: Message): any {
        if (!message.member.hasPermission('MANAGE_ROLES') && !userBypass(message.author.id))
            return message.channel.send(`You don't have the permission to manage roles.`);

        enum Actions {
            SELECT_ACTION = 0,
            DELETE_SELECT_EMOJI = 1,
            ADD_SELECT_EMOJI = 2,
            ADD_SELECT_ROLE = 3,
        }

        let msgs_sent_amount = 0;
        let current_action: Actions = Actions.SELECT_ACTION;
        let selected_emoji: string = null;
        let last_timeout_id: NodeJS.Timeout;
        const pairs: Record<string, Snowflake> = {};

        const update = (content = '') => {
            const e = new MessageEmbed()
                .setTitle('Reaction/Self Roles')
                .setDescription(`Hey, ${message.author}, pick one of the options below and say it!`)
                .addField('1) Add a pair', 'Emoji -> Role pair')
                .addField('2) Delete a pair', 'Deletes a pair by emoji.')
                .addField('3) Done', 'Finishes this up and deletes the messages.')
                .addField('4) Cancel', 'Cancels this and deletes the messages.');

            const out = new Collection(Object.entries(pairs))
                .map((role, emoji) => `${message.guild.emojis.cache.get(emoji) || emoji} -> <@&${role}>`)
                .join('\n');
            e.addField('Current added roles', out.length > 0 ? out : '*None yet*');
            if (content) message.channel.send(content, e);
            else message.channel.send(e);
        };

        const parseEmoji = (content: string) => {
            const customemoji = content.match(CUSTOM_EMOJI_REGEX);
            if (customemoji) return customemoji[3];
            const unicodeemoji = content.match(UNICODE_EMOJI_REGEX);
            if (unicodeemoji) return unicodeemoji[0];
            return null;
        };

        const collector = message.channel.createMessageCollector(() => true);

        const newTimeout = () => {
            clearInterval(last_timeout_id);
            last_timeout_id = setTimeout(() => {
                message.channel.send(
                    `${message.author}, it has been 10 minutes since you last sent something so I have automatically canceled.`
                );
                collector.stop();
            }, 10 * 60 * 1000);
        };

        collector.on('collect', async (m: Message) => {
            m.channel = m.channel as TextChannel;

            msgs_sent_amount++;
            if (message.author.id !== m.author.id) return;
            newTimeout();

            switch (current_action) {
                case Actions.SELECT_ACTION: {
                    switch (m.content) {
                        case '1':
                            message.channel.send('Give me an emoji.');
                            return (current_action = Actions.ADD_SELECT_EMOJI);
                        case '2': {
                            message.channel.send('Give me an emoji that you already added.');
                            return (current_action = Actions.DELETE_SELECT_EMOJI);
                        }
                        case '3': {
                            collector.stop();
                            return m.channel
                                .bulkDelete(clamp(msgs_sent_amount, 0, 100))
                                .then(() => {
                                    let error: DiscordAPIError;
                                    for (const emoji in pairs) message.react(emoji).catch((e) => (error = e));
                                    if (error) message.channel.send(error.message);
                                    addReactionRolesToDB(message, pairs);
                                    m.channel
                                        .send('I reacted to your original message, now you can edit it to your liking.')
                                        .then((m) => m.delete({ timeout: 5000 }).catch(NOOP));
                                    clearInterval(last_timeout_id);
                                })
                                .catch((e: any) => m.author.send(e).catch(NOOP));
                        }
                        case '4':
                            collector.stop();
                            clearInterval(last_timeout_id);
                            return m.channel.bulkDelete(clamp(msgs_sent_amount, 0, 100));
                        default:
                            return message.channel.send('That is not one of the options!');
                    }
                }
                case Actions.ADD_SELECT_EMOJI: {
                    selected_emoji = parseEmoji(m.content);
                    if (!selected_emoji) return message.channel.send('That is not a emoji!');
                    current_action = Actions.ADD_SELECT_ROLE;
                    return message.channel.send('Now give me a role! Format: { Mention | RoleID | Role Name }');
                }
                case Actions.ADD_SELECT_ROLE: {
                    let r: Role;
                    try {
                        r = await (m.mentions.roles.first() ||
                            message.guild.roles.cache.find((r) => r.name === m.content || r.id === m.content));
                        if (!r) return message.channel.send(`Couldn't find a role by \`${m.content}\``);
                    } catch (error) {
                        return message.channel.send(`Couldn't find a role by \`${m.content}\``);
                    }
                    if (r.managed) return message.channel.send(`You can't add auto-managed bot roles to users!`);
                    if (r.id === message.guild.id)
                        return message.channel.send(`You can't assign \`@everyone\` to users, they already have it!`);
                    if (message.guild.me.roles.highest.position < r.position)
                        return message.channel.send(
                            `I can't assign the role ${r.name} because it is higher in the role heiarchy than me.`
                        );
                    pairs[selected_emoji] = r.id;
                    current_action = Actions.SELECT_ACTION;
                    return update(`Success! Added role \`${r.name}\``);
                }
                case Actions.DELETE_SELECT_EMOJI: {
                    selected_emoji = parseEmoji(m.content);
                    if (!selected_emoji) return message.channel.send('That is not a emoji!');
                    if (!pairs[selected_emoji]) return message.channel.send(`That pair doesn't exist!`);
                    current_action = Actions.SELECT_ACTION;
                    delete pairs[selected_emoji];
                    return update('Successfully deleted pair!');
                }
            }
        });

        update();
    }
}

export async function onMessageReactionAdd(reaction: MessageReaction, user: User | PartialUser): Promise<any> {
    try {
        await reaction.fetch();
    } catch (error) {
        return;
    }

    if (reaction.message.channel.type !== 'text' || user.bot) return;

    const guildSelfRoles = getGuildReactionRoles(reaction.message.guild);
    if (guildSelfRoles === {} || !guildSelfRoles[reaction.message.id]) return;
    const msgSelfRoles = guildSelfRoles[reaction.message.id];

    const member = reaction.message.guild.member(user as User);
    if (!member) return;

    let emojiToAdd: string;
    if (reaction.emoji instanceof ReactionEmoji && msgSelfRoles[reaction.emoji.name])
        emojiToAdd = msgSelfRoles[reaction.emoji.name];
    else if (reaction.emoji instanceof GuildEmoji && msgSelfRoles[reaction.emoji.id])
        emojiToAdd = msgSelfRoles[reaction.emoji.id];

    if (!emojiToAdd) return reaction.remove().catch(NOOP);

    member.roles.add(emojiToAdd).catch((r) => {
        member.send(r).catch(NOOP);
    });
}

export async function onMessageReactionRemove(reaction: MessageReaction, user: User | PartialUser): Promise<any> {
    try {
        await reaction.fetch();
    } catch (error) {
        return;
    }

    if (reaction.message.channel.type !== 'text' || user.bot) return;

    const guildSelfRoles = getGuildReactionRoles(reaction.message.guild);
    if (guildSelfRoles === {} || !guildSelfRoles[reaction.message.id]) return;
    const msgSelfRoles = guildSelfRoles[reaction.message.id];

    const member = reaction.message.guild.member(user as User);
    if (!member) return;

    let emojiToAdd: string;
    if (reaction.emoji instanceof ReactionEmoji && msgSelfRoles[reaction.emoji.name])
        emojiToAdd = msgSelfRoles[reaction.emoji.name];
    else if (reaction.emoji instanceof GuildEmoji && msgSelfRoles[reaction.emoji.id])
        emojiToAdd = msgSelfRoles[reaction.emoji.id];

    if (!emojiToAdd) return reaction.remove().catch(NOOP);

    member.roles.remove(emojiToAdd).catch((r) => {
        member.send(r).catch(NOOP);
    });
}

export function onMessageDelete(message: Message | PartialMessage): any {
    const guildSelfRoles = getGuildReactionRoles(message.guild);
    if (guildSelfRoles[message.id]) {
        db.prepare('DELETE FROM reaction_roles WHERE message = ?').run(message.id);
        guildSelfRolesCache.del(message.guild.id);
    }
}
