"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const commands_1 = require("../commands");
class Avatar extends commands_1.Command {
    constructor() {
        super(...arguments);
        this.trigger = 'avatar';
        this.category = commands_1.Categories.UTIL;
        this.name = 'Profile Picture';
        this.description = `Get the profile picture of a user.`;
        this.usage = '{ Mention | UserID | user#0000 }';
        this.guildOnly = true;
        this.unlisted = false;
        this.nsfw = false;
    }
    async invoke(message, args) {
        if (args.length === 0)
            return message.channel.send('Invalid arguments!\n' + this.usage);
        let t;
        try {
            const tag = args.join(' ').split('#');
            t = await (message.mentions.members?.first() ||
                message.guild?.members.fetch(args[0]) ||
                (await message.guild?.members.fetch({ limit: Infinity, query: tag[0] }))?.find(m => m.user.discriminator === tag[1]));
        }
        catch (error) {
            return message.channel.send(`Couldn't find a user by \`${args[0]}\``);
        }
        if (!t)
            return message.channel.send(`Couldn't find a user by \`${args[0]}\``);
        const embed = new discord_js_1.default.MessageEmbed()
            .setTitle(`${t.user.tag}'s avatar`)
            .setColor(0xf9f5ea)
            .setDescription(`[64px](${t.user.displayAvatarURL({ size: 64, format: 'png', dynamic: true })}) | ` +
            `[256px](${t.user.displayAvatarURL({ size: 256, format: 'png', dynamic: true })}) | ` +
            `[512px](${t.user.displayAvatarURL({ size: 512, format: 'png', dynamic: true })}) | ` +
            `[1024px](${t.user.displayAvatarURL({ size: 1024, format: 'png', dynamic: true })})`)
            .setImage(t.user.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }));
        message.channel.send(embed);
    }
}
exports.default = Avatar;
