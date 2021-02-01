"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("../commands");
const eightballReplies = [
    'It is certain.',
    'https://i.redd.it/qh7mgkucu2y21.jpg',
    'Without a doubt. ',
    'Yes - definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Outlook good.',
    'Signs point to yes.',
    `Don't count on it.`,
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'x to doubt.',
];
class EightBall extends commands_1.Command {
    constructor() {
        super(...arguments);
        this.trigger = '8ball';
        this.category = commands_1.Categories.FUN;
        this.name = '🎱 8Ball';
        this.description = 'Ask the 8ball a question, and it will give you an answer.';
        this.usage = '{question}';
        this.guildOnly = false;
        this.unlisted = false;
        this.nsfw = false;
    }
    invoke(message, args) {
        if (args.length === 0)
            return message.channel.send(`Wheres the question? `);
        message.channel.reply(eightballReplies[Math.floor(Math.random() * eightballReplies.length)]);
    }
}
exports.default = EightBall;
