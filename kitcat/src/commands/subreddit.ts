import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import { getTopPost } from '../util/reddit';

export class Subreddit extends Command {
    executor = 'subreddit';
    category = 'fun';
    display_name = '🌐 Subreddit';
    description = `Get a top post from a subreddit! (NSFW subreddits allowed in NSFW channels)`;
    usage = '{subreddit}';
    guildOnly = false;
    unlisted = false;
    nsfw = false;

    run(message: Discord.Message, args: string[], settings: IGuildSettings) {
        if (args.length === 0) return message.channel.send(`Missing subreddit name!`);
        getTopPost(message, args[0]);
    }
}
