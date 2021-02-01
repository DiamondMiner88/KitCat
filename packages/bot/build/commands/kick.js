"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importStar(require("discord.js"));
const commands_1 = require("../commands");
const utils_1 = require("../util/utils");
class Kick extends commands_1.Command {
    constructor() {
        super(...arguments);
        this.trigger = 'kick';
        this.category = commands_1.Categories.MODERATION;
        this.name = 'Ban';
        this.description = `Used to kick members.`;
        this.usage = '{ Mention | UserID } [reason]';
        this.guildOnly = true;
        this.unlisted = false;
        this.nsfw = false;
    }
    async invoke(message, args) {
        if (!utils_1.hasPermission(message.member, discord_js_1.Permissions.FLAGS.KICK_MEMBERS))
            return message.channel.send(`You cannot kick people!`);
        if (args.length === 0)
            return message.channel.send('Invalid arguments!\n' + this.formattedUsage);
        let t;
        try {
            t = await (message.mentions.members?.first() || message.guild?.members.fetch(args[0]));
        }
        catch {
            return message.channel.send(`Couldn't find a user by \`${args[0]}\``);
        }
        if (!t)
            return message.channel.send(`Couldn't find a user by \`${args[0]}\``);
        args.shift();
        if (!t.bannable)
            return message.channel.send(`I don't have the permission to kick that user! Check my permissions, or my role in the hierarchy.`);
        const reason = `Banned by ${message.author.tag} with ` + (args.length > 0 ? `reason "${args.join(' ')}".` : 'no reason.');
        const logMsg = new discord_js_1.default.MessageEmbed()
            .setTitle(`*${t.user.username} got yeeted out the window*`)
            .setDescription(`ID: ${t.id}`)
            .setColor(0xf9f5ea)
            .addField('User kicked', `${t}`)
            .addField('Kicked By', `${message.author}`)
            .addField('Reason', reason);
        const uGotBanned = new discord_js_1.default.MessageEmbed()
            .setTitle(`You got kicked from \`${message.guild?.name}\``)
            .setColor(0xf9f5ea)
            .addField('Kicked By', `${message.author}`)
            .addField('Reason', reason);
        message.channel.send(logMsg).catch(utils_1.NOOP);
        await t.send(uGotBanned).catch(utils_1.NOOP);
        t.ban({
            reason,
        }).catch(err => message.channel.send(`Couldn't kick the user: ${err.message}`));
    }
}
exports.default = Kick;
