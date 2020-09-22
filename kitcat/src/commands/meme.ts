import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './_Command';
import { getTopPost } from '../util/reddit';

export class Meme extends Command {
  constructor() {
    super();
    this.executor = 'meme';
    this.category = 'fun';
    this.display_name = '😂 Memes';
    this.description = `Get a meme from r/dankmemes`;
    this.usage = 'meme';
    this.guildOnly = false;
    this.unlisted = false;
    this.nsfw = false;
  }

  run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    getTopPost(message, 'dankmemes');
  }
}
