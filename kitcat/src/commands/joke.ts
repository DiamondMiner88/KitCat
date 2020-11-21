import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import fetch from 'node-fetch';

export class Joke extends Command {
    constructor() {
        super();
        this.executor = 'joke';
        this.category = 'fun';
        this.display_name = '😂 Joke';
        this.description = `Get a (probably bad) joke. (Isn't your life a big enough joke already?)`;
        this.usage = '';
        this.guildOnly = false;
        this.unlisted = false;
        this.nsfw = false;
    }

    async run(message: Discord.Message, args: string[], settings: IGuildSettings) {
        const res = await fetch('https://official-joke-api.appspot.com/random_joke');
        const json = await res.json();
        return message.channel.send(`${json.setup}\n${json.punchline}`);
    }
}
