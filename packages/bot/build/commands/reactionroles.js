"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageReactionRemove = exports.onMessageReactionAdd = exports.addReactionRolesToDB = exports.getMessageRRSet = void 0;
const discord_js_1 = require("discord.js");
const commands_1 = require("../commands");
const utils_1 = require("../util/utils");
const db_1 = require("../db");
const node_cache_1 = __importDefault(require("node-cache"));
const rrSetCache = new node_cache_1.default();
async function getMessageRRSet(message) {
    let rrset = rrSetCache.get(message.id);
    if (rrset)
        return rrset;
    let fetched = await db_1.prisma.rRSet.findFirst({ where: { messageId: message.id } });
    if (!fetched)
        return undefined;
    console.log(fetched.json);
    rrSetCache.set(message.id, fetched.json, utils_1.clamp((message.guild.memberCount / 5) * 60, 300, 7200));
    return fetched.json;
}
exports.getMessageRRSet = getMessageRRSet;
function addReactionRolesToDB(message, roles) {
    db_1.prisma.rRSet.create({
        data: {
            messageId: message.id,
            guildId: message.guild.id,
            channelId: message.channel.id,
            json: roles,
        },
    });
    rrSetCache.del(message.id);
}
exports.addReactionRolesToDB = addReactionRolesToDB;
class Roles extends commands_1.Command {
    constructor() {
        super(...arguments);
        this.trigger = 'reactionroles';
        this.category = commands_1.Categories.MODERATION;
        this.name = 'Reaction Roles';
        this.description = `Make a message that when reacted to, assigns you a role.`;
        this.usage = '';
        this.guildOnly = true;
        this.unlisted = false;
        this.nsfw = false;
    }
    invoke(message) {
        if (!utils_1.hasPermission(message.member, discord_js_1.Permissions.FLAGS.MANAGE_ROLES))
            return message.channel.send(`You don't have the permission to do that!`);
        let Actions;
        (function (Actions) {
            Actions[Actions["SELECT_ACTION"] = 0] = "SELECT_ACTION";
            Actions[Actions["DELETE_SELECT_EMOJI"] = 1] = "DELETE_SELECT_EMOJI";
            Actions[Actions["ADD_SELECT_EMOJI"] = 2] = "ADD_SELECT_EMOJI";
            Actions[Actions["ADD_SELECT_ROLE"] = 3] = "ADD_SELECT_ROLE";
        })(Actions || (Actions = {}));
        let msgs_sent_amount = 0;
        let current_action = Actions.SELECT_ACTION;
        let selected_emoji = null;
        let last_timeout_id;
        const pairs = {};
        const update = (content = '') => {
            const e = new discord_js_1.MessageEmbed()
                .setTitle('Reaction/Self Roles')
                .setDescription(`Hey, ${message.author}, pick one of the options below and say it!`)
                .addField('1) Add a pair', 'Emoji -> Role pair')
                .addField('2) Delete a pair', 'Deletes a pair by emoji.')
                .addField('3) Done', 'Finishes this up and deletes the messages.')
                .addField('4) Cancel', 'Cancels this and deletes the messages.');
            const out = new discord_js_1.Collection(Object.entries(pairs))
                .map((role, emoji) => `${message.guild?.emojis.cache.get(emoji) || emoji} -> <@&${role}>`)
                .join('\n');
            e.addField('Current added roles', out.length > 0 ? out : '*None yet*');
            if (content)
                message.channel.send(content, e);
            else
                message.channel.send(e);
        };
        const parseEmoji = (content) => {
            const customemoji = content.match(utils_1.CUSTOM_EMOJI_REGEX);
            if (customemoji)
                return customemoji[3];
            const unicodeemoji = content.match(utils_1.UNICODE_EMOJI_REGEX);
            if (unicodeemoji)
                return unicodeemoji[0];
            return null;
        };
        const collector = message.channel.createMessageCollector(() => true);
        const newTimeout = () => {
            clearInterval(last_timeout_id);
            last_timeout_id = setTimeout(() => {
                message.channel.send(`${message.author}, it has been 10 minutes since you last sent something so I have automatically canceled.`);
                collector.stop();
            }, 10 * 60 * 1000);
        };
        collector.on('collect', async (m) => {
            m.channel = m.channel;
            msgs_sent_amount++;
            if (message.author.id !== m.author.id)
                return;
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
                                .bulkDelete(utils_1.clamp(msgs_sent_amount, 0, 100))
                                .then(() => {
                                let error = null;
                                for (const emoji in pairs)
                                    message.react(emoji).catch(e => (error = e));
                                if (error)
                                    message.channel.send(error.message);
                                addReactionRolesToDB(message, pairs);
                                m.channel
                                    .send('I reacted to your original message, now you can edit it to your liking.')
                                    .then(m => setTimeout(() => m.delete().catch(utils_1.NOOP), 5000));
                                clearInterval(last_timeout_id);
                            })
                                .catch((e) => m.author.send(e).catch(utils_1.NOOP));
                        }
                        case '4':
                            collector.stop();
                            clearInterval(last_timeout_id);
                            return m.channel.bulkDelete(utils_1.clamp(msgs_sent_amount, 0, 100));
                        default:
                            return message.channel.send('That is not one of the options!');
                    }
                }
                case Actions.ADD_SELECT_EMOJI: {
                    selected_emoji = parseEmoji(m.content);
                    if (!selected_emoji)
                        return message.channel.send('That is not a emoji!');
                    current_action = Actions.ADD_SELECT_ROLE;
                    return message.channel.send('Now give me a role! Format: { Mention | RoleID | Role Name }');
                }
                case Actions.ADD_SELECT_ROLE: {
                    let r;
                    try {
                        r = await (m.mentions.roles.first() || message.guild?.roles.cache.find(r => r.name === m.content || r.id === m.content));
                    }
                    catch (error) {
                        return message.channel.send(`Couldn't find a role by \`${m.content}\``);
                    }
                    if (!r)
                        return message.channel.send(`Couldn't find a role by \`${m.content}\``);
                    if (r.managed)
                        return message.channel.send(`You can't add auto-managed bot roles to users!`);
                    if (r.id === message.guild?.id)
                        return message.channel.send(`You can't assign \`@everyone\` to users, they already have it!`);
                    if (message.guild.me.roles.highest.position < r.position)
                        return message.channel.send(`I can't assign the role ${r.name} because it is higher in the role heiarchy than me.`);
                    pairs[selected_emoji] = r.id;
                    current_action = Actions.SELECT_ACTION;
                    return update(`Success! Added role \`${r.name}\``);
                }
                case Actions.DELETE_SELECT_EMOJI: {
                    selected_emoji = parseEmoji(m.content);
                    if (!selected_emoji)
                        return message.channel.send('That is not a emoji!');
                    if (!pairs[selected_emoji])
                        return message.channel.send(`That pair doesn't exist!`);
                    current_action = Actions.SELECT_ACTION;
                    delete pairs[selected_emoji];
                    return update('Successfully deleted pair!');
                }
            }
        });
        update();
    }
}
exports.default = Roles;
async function onMessageReactionAdd(reaction, user) {
    try {
        await reaction.fetch();
    }
    catch (error) {
        return;
    }
    if (reaction.message.channel.type !== 'text' || user.bot)
        return;
    const msgSelfRoles = await getMessageRRSet(reaction.message);
    if (!msgSelfRoles)
        return;
    const member = await reaction.message.guild.members.fetch(user);
    if (!member)
        return;
    let emojiToAdd;
    if (reaction.emoji instanceof discord_js_1.ReactionEmoji && msgSelfRoles[reaction.emoji.name])
        emojiToAdd = msgSelfRoles[reaction.emoji.name];
    else if (reaction.emoji instanceof discord_js_1.GuildEmoji && msgSelfRoles[reaction.emoji.id])
        emojiToAdd = msgSelfRoles[reaction.emoji.id];
    if (!emojiToAdd)
        return reaction.remove().catch(utils_1.NOOP);
    member.roles.add(emojiToAdd, `${member.user.tag} requested for the role to be added using a reaction.`).catch(r => {
        member.send(r).catch(utils_1.NOOP);
    });
}
exports.onMessageReactionAdd = onMessageReactionAdd;
async function onMessageReactionRemove(reaction, user) {
    try {
        await reaction.fetch();
    }
    catch (error) {
        return;
    }
    if (reaction.message.channel.type !== 'text' || user.bot)
        return;
    const msgSelfRoles = await getMessageRRSet(reaction.message);
    if (!msgSelfRoles)
        return;
    const member = await reaction.message.guild.members.fetch(user);
    if (!member)
        return;
    let emojiToAdd;
    if (reaction.emoji instanceof discord_js_1.ReactionEmoji && msgSelfRoles[reaction.emoji.name])
        emojiToAdd = msgSelfRoles[reaction.emoji.name];
    else if (reaction.emoji instanceof discord_js_1.GuildEmoji && msgSelfRoles[reaction.emoji.id])
        emojiToAdd = msgSelfRoles[reaction.emoji.id];
    if (!emojiToAdd)
        return reaction.remove().catch(utils_1.NOOP);
    member.roles.remove(emojiToAdd, `${member.user.tag} requested for the role to be removed using a reaction.`).catch(r => {
        member.send(r).catch(utils_1.NOOP);
    });
}
exports.onMessageReactionRemove = onMessageReactionRemove;
