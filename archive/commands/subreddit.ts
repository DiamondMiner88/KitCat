import Discord from 'discord.js';
import { Command, Categories } from '../commands';
import { getTopPost } from '../util/reddit';

export default class Subreddit extends Command {
    trigger = 'subreddit';
    category = Categories.FUN;
    name = '🌐 Subreddit';
    description = `Get a top post from a subreddit! (NSFW subreddits allowed in NSFW channels)`;
    usage = '{subreddit}';
    guildOnly = false;
    unlisted = false;
    nsfw = false;

    invoke(message: Discord.Message, args: string[]): any {
        if (args.length === 0) return message.channel.send(`Missing subreddit name!`);
        getTopPost(message, args[0]);
    }
}
