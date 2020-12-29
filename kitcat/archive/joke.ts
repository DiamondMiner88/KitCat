import Discord from 'discord.js';
import { Command } from '../commands';
import fetch from 'node-fetch';

export default class Joke extends Command {
    trigger = 'joke';
    category = 'fun';
    name = '😂 Joke';
    description = `Get a (probably bad) joke.`;
    usage = '';
    guildOnly = false;
    unlisted = false;
    nsfw = false;

    async run(message: Discord.Message): Promise<any> {
        const res = await fetch('https://official-joke-api.appspot.com/random_joke');
        const json = await res.json();
        return message.channel.send(`${json.setup}\n${json.punchline}`);
    }
}
