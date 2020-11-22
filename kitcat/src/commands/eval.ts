import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import { userBypass } from '../util/permissions';

export class Eval extends Command {
    executor = 'eval';
    category = 'util';
    display_name = 'Eval';
    description = `Eval command`;
    usage = '';
    guildOnly = false;
    unlisted = true;
    nsfw = false;

    async run(message: Discord.Message, args: string[], settings: IGuildSettings) {
        if (!userBypass(message.author.id)) return;
        function clean(text: string) {
            if (typeof text === 'string')
                return text
                    .replace(/`/g, '`' + String.fromCharCode(8203))
                    .replace(/@/g, '@' + String.fromCharCode(8203));
            else return text;
        }

        try {
            /* tslint:disable */
            let evaled = await eval(args.join(' '));
            /* tslint:enable */
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            if (clean(evaled).length > 2000)
                return message.channel.send(`Can't send message, is bigger than 2000 characters.`);
            message.channel.send(clean(evaled), { code: 'xl' });
        } catch (error) {
            message.channel.send(`\`\`\`xl\n${clean(error)}\n\`\`\``);
        }
    }
}
