import Discord from 'discord.js';
import { Command, Categories } from '../commands';
import { devPerms } from '../util/utils';
import { inspect } from 'util';

export default class Eval extends Command {
    trigger = 'eval';
    category = Categories.UTIL;
    name = 'Eval';
    description = `Evaluate JavaScript Code. Developer only.`;
    usage = '{code}';
    guildOnly = false;
    unlisted = true;
    nsfw = false;

    async invoke(message: Discord.Message, args: string[]): Promise<any> {
        if (!devPerms(message.author.id)) return;

        const clean = (text: string) => {
            if (typeof text === 'string') return text.replace(/`/g, '`\u200b').replace(/@/g, '@\u200b');
            else return text;
        };

        try {
            let evaled = await eval(args.join(' '));
            if (typeof evaled !== 'string') evaled = inspect(evaled);
            message.channel.send(clean(evaled), { code: 'xl', split: true });
        } catch (error) {
            message.channel.send(`${clean(error)}`, { code: 'xl', split: true });
        }
    }
}
