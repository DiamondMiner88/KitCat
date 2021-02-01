"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const commands_1 = require("../commands");
const node_fetch_1 = __importDefault(require("node-fetch"));
class Pet extends commands_1.Command {
    constructor() {
        super(...arguments);
        this.trigger = 'pet';
        this.category = commands_1.Categories.FUN;
        this.name = '🌭 Pet';
        this.description = `Get a photo/gif of kitties, dogs or other cute pets!`;
        this.usage = '{animal name | help}';
        this.guildOnly = false;
        this.unlisted = false;
        this.nsfw = false;
    }
    async invoke(message, args) {
        const prefix = 'k!';
        if (args.length === 0)
            return message.channel.send(`What pet do you want? \`${prefix}pet {animal}\``);
        const subcommand = args.shift();
        switch (subcommand) {
            case 'help': {
                return message.channel.send(new discord_js_1.default.MessageEmbed()
                    .setColor(0xf9f5ea)
                    .setTitle('Supported pets')
                    .addField(':cat: Cat', `\`${prefix}pet cat\``)
                    .addField(':dog: Doggo', `\`${prefix}pet dog\``));
            }
            case 'cat':
            case 'kitty': {
                return message.channel.send(new discord_js_1.default.MessageEmbed().setTitle(`Here's a cat for you!`).setImage('https://cataas.com/cat'));
            }
            case 'dog': {
                const res = await node_fetch_1.default('https://dog.ceo/api/breeds/image/random');
                const json = await res.json();
                if (json.status !== 'success') {
                    this.log('error', json);
                    return message.channel.send('An error occured with the dog api we used! This error was reported!');
                }
                return message.channel.send(new discord_js_1.default.MessageEmbed().setColor(0xf9f5ea).setTitle(`Here's A doggo For You!`).setImage(json.message));
            }
        }
    }
}
exports.default = Pet;
