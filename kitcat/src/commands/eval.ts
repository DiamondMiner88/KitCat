import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import { userBypass } from '../util/permissions';

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
    if (!userBypass(message.author.id)) return;
    function clean(text: string) {
      if (typeof text === 'string')
        return text
          .replace(/`/g, '`' + String.fromCharCode(8203))
          .replace(/@/g, '@' + String.fromCharCode(8203));
      else return text;
    }

    try {
      const Discord = require('discord.js'); // Import lib so you don't have to do it when evaling

      let evaled = eval(args.join(' '));
      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
      message.channel.send(clean(evaled), { code: 'xl' });
    } catch (error) {
      message.channel.send(`\`\`\`xl\n${clean(error)}\n\`\`\``);
    }
  }
}
