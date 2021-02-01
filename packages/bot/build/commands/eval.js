"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("../commands");
const utils_1 = require("../util/utils");
const util_1 = require("util");
class Eval extends commands_1.Command {
    constructor() {
        super(...arguments);
        this.trigger = 'eval';
        this.category = commands_1.Categories.UTIL;
        this.name = 'Eval';
        this.description = `Evaluate JavaScript Code. Developer only.`;
        this.usage = '{code}';
        this.guildOnly = false;
        this.unlisted = true;
        this.nsfw = false;
    }
    async invoke(message, args) {
        if (!utils_1.devPerms(message.author.id))
            return;
        const clean = (text) => {
            if (typeof text === 'string')
                return text.replace(/`/g, '`\u200b').replace(/@/g, '@\u200b');
            else
                return text;
        };
        try {
            let evaled = await eval(args.join(' '));
            if (typeof evaled !== 'string')
                evaled = util_1.inspect(evaled);
            message.channel.send(clean(evaled), { code: 'xl', split: true });
        }
        catch (error) {
            message.channel.send(`${clean(error)}`, { code: 'xl', split: true });
        }
    }
}
exports.default = Eval;
