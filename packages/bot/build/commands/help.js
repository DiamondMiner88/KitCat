"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const commands_1 = require("../commands");
const index_1 = require("../index");
const gh_issues = 'https://github.com/KitCat-Bot/KitCat/issues';
const footer = 'Format: `[]` => Optional, `{}` => Required, `|` => Or, `=` => default';
class Help extends commands_1.Command {
    constructor() {
        super(...arguments);
        this.trigger = 'help';
        this.category = commands_1.Categories.KITCAT;
        this.name = 'Help';
        this.description = `What you're looking at right now.`;
        this.usage = '[ Category | Command ]';
        this.guildOnly = false;
        this.unlisted = false;
        this.nsfw = false;
    }
    invoke(message, args) {
        const embed = new discord_js_1.default.MessageEmbed().setColor(0xf9f5ea);
        if (args.length === 0) {
            embed.setTitle('Categories');
            commands_1.CategoriesData.forEach(c => embed.addField(c.name, `${c.description}\n\`/help ${c.name}\``));
        }
        else {
            const target = commands_1.CategoriesData.find(c => c.name === args[0]) || index_1.client.commands.find(c => c.trigger === args[0]);
            if (!target)
                return message.channel.send(`No commands or categories under that name exist!`);
            if (target instanceof commands_1.Command) {
                embed.setTitle(target.name);
                embed.addField(target.description !== '' ? target.description : '\u200B', target.formattedUsage);
            }
            else {
                embed.setTitle(target.name).setDescription(target.description);
                index_1.client.commands
                    .filter(c => commands_1.CategoriesData[c.category].name === target.name && !c.unlisted)
                    .forEach(c => embed.addField(c.name, c.description + '\n' + c.formattedUsage));
            }
        }
        embed.addField('Bugs', `Found an issue? Report it [here](${gh_issues}) or do /foundBug`).setFooter(footer);
        message.channel.send(embed);
    }
}
exports.default = Help;
