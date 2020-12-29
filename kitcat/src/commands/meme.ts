import Discord from 'discord.js';
import { Command, Categories } from '../commands';
import { getTopPost } from '../util/reddit';

export default class Meme extends Command {
    trigger = 'meme';
    category = Categories.FUN;
    name = '😂 Memes';
    description = `Get a meme from r/dankmemes`;
    usage = 'meme';
    guildOnly = false;
    unlisted = false;
    nsfw = false;

    invoke(message: Discord.Message): any {
        getTopPost(message, 'dankmemes');
    }
}
