"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const commands_1 = require("../commands");
const node_fetch_1 = __importDefault(require("node-fetch"));
class NameMC extends commands_1.Command {
    constructor() {
        super(...arguments);
        this.trigger = 'mcuser';
        this.category = commands_1.Categories.UTIL;
        this.name = 'Minecraft Username History';
        this.description = `See players's skin, username history, and a link to thier user page on namemc.`;
        this.usage = '{username}';
        this.guildOnly = false;
        this.unlisted = false;
        this.nsfw = false;
    }
    invoke(message, args) {
        if (args.length === 0)
            return message.channel.send(`You didn't provide a username. :P`);
        node_fetch_1.default(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`)
            .then(res => res.json())
            .then(user => node_fetch_1.default(`https://api.mojang.com/user/profiles/${user.id}/names`)
            .then(res => res.json())
            .then(names => {
            const embed = new discord_js_1.default.MessageEmbed()
                .setTitle(user.name)
                .setDescription('Usernames:')
                .setColor(0xf9f5ea)
                .setURL(`https://namemc.com/profile/${user.name}`)
                .setImage(`https://minotar.net/armor/body/${user.name}/100.png`);
            if (names.error)
                return message.channel.send(names.errorMessage + '\nPlease try again in a few seconds. I have no idea why this happens. Will try to fix later.');
            names.forEach((name) => {
                const date = 'temp';
                embed.addField(discord_js_1.default.Util.escapeMarkdown(name.name), discord_js_1.default.Util.escapeMarkdown(name.changedToAt ? `${date} UTC` : 'Initial username'));
            });
            return message.channel.send(embed);
        })
            .catch(error => message.channel.send(error.message)))
            .catch(error => {
            if (error.message.startsWith('invalid json response body at'))
                message.channel.send('This this not a valid user!');
            else {
                this.log('error', error);
                message.channel.send(error.message);
            }
        });
    }
}
exports.default = NameMC;
