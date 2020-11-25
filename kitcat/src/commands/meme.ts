import Discord from 'discord.js';
import { Command } from '../commands';
import { getTopPost } from '../util/reddit';

export default class Meme extends Command {
    executor = 'meme';
    category = 'fun';
    display_name = '😂 Memes';
    description = `Get a meme from r/dankmemes`;
    usage = 'meme';
    guildOnly = false;
    unlisted = false;
    nsfw = false;

    run(message: Discord.Message): void {
        getTopPost(message, 'dankmemes');
    }
}
