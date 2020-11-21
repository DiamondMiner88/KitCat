import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';

export class Status extends Command {
    constructor() {
        super();
        this.executor = 'status';
        this.category = 'kitcat';
        this.display_name = `KitCat's Status`;
        this.description = `KitCat's Service's Statuses`;
        this.usage = '';
        this.guildOnly = false;
        this.unlisted = false;
        this.nsfw = false;
    }
}
