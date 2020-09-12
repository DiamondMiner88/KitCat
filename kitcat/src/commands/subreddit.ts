import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './_Command';
import { getTopPost } from '../util/reddit';

export class Subreddit extends Command {
  constructor() {
    super();
    this.executor = 'subreddit';
    this.category = 'fun';
    this.displayName = '🌐 Subreddit';
    this.description = `Get a top post from a subreddit! (NSFW subreddits allowed in NSFW channels)`;
    this.usage = '{subreddit}';
    this.guildOnly = false;
    this.unlisted = false;
    this.nsfw = false;
  }

  run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    if (args.length === 0) return message.channel.send(`Missing subreddit name!`);
    getTopPost(message, args[0]);
  }
}
