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
} from 'discord.js';
import { getGuildSelfRoles, IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import { UNICODE_EMOJI_REGEX, CUSTOM_EMOJI_REGEX, clamp } from '../util/utils';
import { addSelfRolesToDB } from '../cache';
import { userBypass } from '../util/permissions';

export class Roles extends Command {
    constructor() {
        super();
        this.executor = 'roles';
        this.category = 'moderation';
        this.display_name = 'Reaction Roles';
        this.description = `Make a message that when reacted to, assigns you a role.`;
        this.usage = '';
        this.guildOnly = true;
        this.unlisted = false;
        this.nsfw = false;
    }

    run(message: Message, args: string[], settings: IGuildSettings) {
        if (!message.member.hasPermission('MANAGE_ROLES') && !userBypass(message.author.id))
            return message.channel.send(`You don't have the permission to manage roles.`);

        let active = true;
        let msg_amnt = 0;
        // 0 if not, 1 is selecting emoji, 2 is selecting role
        let adding_role: 0 | 1 | 2 = 0;
        // curr emoji if one
        let curr_adding_role: string = null;
        const roles: Record<string, Snowflake> = {};

        function update() {
            const e = new MessageEmbed()
                .setTitle('Reaction/Self Roles')
                .setDescription(`Hey, ${message.author}, pick one of the options below and say it!`)
                .addField('1) Add a role', 'Add an emoji to role correlation')
                .addField('2) Done', 'Reacts to your message with the added emojis and listens for future reacts')
                .addField('3) Cancel', 'Cancels');

            const out = new Collection(Object.entries(roles))
                .map((role, emoji) => `${message.guild.emojis.cache.get(emoji) || emoji} -> <@&${role}>`)
                .join('\n');
            e.addField('Current added roles', out.length > 0 ? out : '*None yet*');
            message.channel.send(e);
        }

        const collector = message.channel.createMessageCollector(() => true);
        collector.on('collect', (m: Message) => {
            m.channel = m.channel as TextChannel;

            msg_amnt++;

            if (message.author.id === m.author.id) {
                if (adding_role === 1) {
                    const customemoji = CUSTOM_EMOJI_REGEX.exec(m.content);
                    const unicodeemoji = UNICODE_EMOJI_REGEX.exec(m.content);

                    if ((!customemoji && !unicodeemoji) || (customemoji && unicodeemoji))
                        return message.channel.send('That is not a valid single emoji!');

                    if (customemoji) curr_adding_role = customemoji[3];
                    else if (unicodeemoji) curr_adding_role = unicodeemoji[0];

                    adding_role = 2;
                    message.channel.send('Mention a role to associate with that emoji!');
                } else if (adding_role === 2) {
                    if (m.mentions.roles.size !== 1) return message.channel.send('You need to mention 1 role!');
                    roles[curr_adding_role] = m.mentions.roles.first().id;
                    message.channel.send(`Added role ${m.mentions.roles.first()}`);
                    adding_role = 0;
                    update();
                } else
                    switch (m.content.toLowerCase()) {
                        case '1':
                            message.channel.send('Please say an emoji to add');
                            adding_role = 1;
                            break;
                        case '2':
                            active = false;
                            collector.stop();
                            m.channel
                                .bulkDelete(clamp(msg_amnt, 0, 100))
                                .then(() => {
                                    for (const emoji in roles) message.react(emoji).catch(() => undefined);
                                    addSelfRolesToDB(message, roles);
                                    m.channel.send(
                                        'I reacted to your original message, now you can edit it to your liking.'
                                    );
                                })
                                .catch((e: any) => m.author.send(e).catch(() => undefined));
                            break;
                        case '3':
                            active = false;
                            collector.stop();
                            m.channel.bulkDelete(clamp(msg_amnt, 0, 100));
                            break;
                        default:
                            message.channel.send('That is not one of the options!');
                            break;
                    }
            }
        });

        update();

        setTimeout(() => {
            if (active) {
                message.channel.send(`${message.author}, it has been 10 minutes so I have automatically canceled.`);
                collector.stop();
            }
        }, 10 * 60 * 1000);
    }
}

export async function onMessageReactionAdd(reaction: MessageReaction, user: PartialUser | User) {
    try {
        await reaction.fetch();
    } catch (error) {
        return;
    }

    if (reaction.message.channel.type !== 'text' || user.bot) return;

    const guildSelfRoles = getGuildSelfRoles(reaction.message.guild);
    if (guildSelfRoles === {} || !guildSelfRoles[reaction.message.id]) return;
    const msgSelfRoles = guildSelfRoles[reaction.message.id];

    if (reaction.emoji instanceof ReactionEmoji && msgSelfRoles[reaction.emoji.name])
        reaction.message.member.roles.add(msgSelfRoles[reaction.emoji.name]).catch((r) => {
            reaction.message.author.send(r).catch(() => undefined);
        });
    else if (reaction.emoji instanceof GuildEmoji && msgSelfRoles[reaction.emoji.id])
        reaction.message.member.roles.add(msgSelfRoles[reaction.emoji.id]).catch((r) => {
            reaction.message.author.send(r).catch(() => undefined);
        });
}

export async function onMessageReactionRemove(reaction: MessageReaction, user: PartialUser | User) {
    try {
        await reaction.fetch();
    } catch (error) {
        return;
    }

    if (reaction.message.channel.type !== 'text' || user.bot) return;

    const guildSelfRoles = getGuildSelfRoles(reaction.message.guild);
    if (guildSelfRoles === {} || !guildSelfRoles[reaction.message.id]) return;
    const msgSelfRoles = guildSelfRoles[reaction.message.id];

    if (reaction.emoji instanceof ReactionEmoji && msgSelfRoles[reaction.emoji.name])
        reaction.message.member.roles.remove(msgSelfRoles[reaction.emoji.name]).catch((r) => {
            reaction.message.author.send(r).catch(() => undefined);
        });
    else if (reaction.emoji instanceof GuildEmoji && msgSelfRoles[reaction.emoji.id])
        reaction.message.member.roles.remove(msgSelfRoles[reaction.emoji.id]).catch((r) => {
            reaction.message.author.send(r).catch(() => undefined);
        });
}
