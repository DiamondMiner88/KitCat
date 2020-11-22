import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import fetch from 'node-fetch';

export class Joke extends Command {
    executor = 'joke';
    category = 'fun';
    display_name = '😂 Joke';
    description = `Get a (probably bad) joke. (Isn't your life a big enough joke already?)`;
    usage = '';
    guildOnly = false;
    unlisted = false;
    nsfw = false;

    async run(message: Discord.Message, args: string[], settings: IGuildSettings) {
        const res = await fetch('https://official-joke-api.appspot.com/random_joke');
        const json = await res.json();
        return message.channel.send(`${json.setup}\n${json.punchline}`);
    }
}
