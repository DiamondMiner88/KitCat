import { Message } from 'discord.js';
import { IGuildSettings } from './settings';
import { Logger, getLogger } from 'log4js';

export abstract class Command {
    abstract readonly trigger: string;
    abstract readonly category: Categories;
    abstract readonly name: string;
    abstract readonly description: string;
    abstract readonly usage?: string;
    abstract readonly guildOnly: boolean = true;
    abstract readonly unlisted: boolean = false;
    abstract readonly nsfw?: boolean = false;
    readonly LOGGER: Logger = (() => getLogger(`command-${this.trigger}`))();

    get formattedUsage(): string {
        return `\`/${this.trigger}${this.usage != null ? ' ' + this.usage : ''}\``;
    }

    abstract invoke(message: Message, args: string[], settings: IGuildSettings): Promise<any>;
}

export enum Categories {
    MODERATION,
    FUN,
    UTIL,
    KITCAT,
}

export const CategoriesData: {
    name: string;
    description: string;
}[] = [
    {
        name: '🚫 Moderation',
        description: 'Commands to help keep your server in shape!',
    },
    {
        name: '😄 Fun',
        description: 'Random, stupid and fun commands!',
    },
    {
        name: '🛠️ Utils',
        description: 'Utility commands that may or may not be helpful!',
    },
    {
        name: '<kitcat emoji> KitCat',
        description: 'Commands related to me!',
    },
];
