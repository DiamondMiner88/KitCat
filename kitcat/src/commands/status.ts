import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';

export class Status extends Command {
    executor = 'status';
    category = 'kitcat';
    display_name = `KitCat's Status`;
    description = `KitCat's Service's Statuses`;
    usage = '';
    guildOnly = false;
    unlisted = false;
    nsfw = false;
}
