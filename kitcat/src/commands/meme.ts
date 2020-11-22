import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import { getTopPost } from '../util/reddit';

export class Meme extends Command {
    executor = 'meme';
    category = 'fun';
    display_name = '😂 Memes';
    description = `Get a meme from r/dankmemes`;
    usage = 'meme';
    guildOnly = false;
    unlisted = false;
    nsfw = false;

    run(message: Discord.Message, args: string[], settings: IGuildSettings) {
        getTopPost(message, 'dankmemes');
    }
}
