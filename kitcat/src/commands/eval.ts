import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './_Command';

export class Eval extends Command {
  constructor() {
    super();
    this.executor = 'eval';
    this.category = 'util';
    this.display_name = 'Eval';
    this.description = `Eval command`;
    this.usage = '';
    this.guildOnly = false;
    this.unlisted = true;
    this.nsfw = false;
  }

  run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    if (!['295190422244950017'].includes(message.author.id)) return;
    function clean(text: string) {
      if (typeof text === 'string')
        return text
          .replace(/`/g, '`' + String.fromCharCode(8203))
          .replace(/@/g, '@' + String.fromCharCode(8203));
      else return text;
    }

    try {
      const code = args.join(' ');
      let evaled = eval(code);

      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);

      message.channel.send(clean(evaled), { code: 'xl' });
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
}
