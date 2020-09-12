import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './_Command';

export class EightBall extends Command {
  constructor() {
    super();
    this.executor = '';
    this.category = 'Category';
    this.displayName = 'Display Name';
    this.description = 'Description';
    this.usage = 'Usage';
    this.guildOnly = false;
    this.unlisted = false;
    this.nsfw = false;
  }

  run(message: Discord.Message, args: string[], settings: IGuildSettings) {

  }
}
