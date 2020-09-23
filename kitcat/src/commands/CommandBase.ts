import { Message } from 'discord.js';
import { Logger, getLogger } from 'log4js';
import { IGuildSettings } from '../cache';

export class Command {
  executor: string;
  aliases: string[];
  category: ICategories;
  display_name: string;
  description?: string;
  usage?: string;
  guildOnly?: boolean = true;
  unlisted?: boolean = false;
  nsfw?: boolean = false;
  // LOGGER: Logger = getLogger(`CMD-${this.executor}`);

  constructor() {
    // this.LOGGER = getLogger(`CMD-${this.executor}`);
  }

  getUsage(settings: IGuildSettings) {
    return `\`${settings.prefix}${this.executor}${this.usage != null ? ' ' + this.usage : ''}\``;
  }

  getCommandHelp(settings: IGuildSettings): [string, string] {
    return [
      this.display_name != null ? this.display_name : this.executor,
      (this.description != null ? this.description + '\n' : '') + this.getUsage(settings)
    ];
  }

  run(message: Message, args: string[], settings: IGuildSettings) {
    message.channel
      .send('This command has not been implemented yet! Coming soon to a shard near you! :P')
      .catch(() => {});
  }
}

type ICategories = 'moderation' | 'fun' | 'util' | 'games' | 'kitcat';
export type ICategory = {
  name: ICategories;
  display_name: string;
  description: string;
};

export const categories: ICategory[] = [
  {
    name: 'moderation',
    display_name: '🚫 Moderation',
    description: 'Commands to help keep your server in shape!'
  },
  {
    name: 'fun',
    display_name: '😄 Fun',
    description: 'Random, stupid and fun commands!'
  },
  {
    name: 'util',
    display_name: '🛠️ Utils',
    description: ''
  },
  {
    name: 'games',
    display_name: '🎲 Games',
    description: ''
  },
  {
    name: 'kitcat',
    display_name: 'Commands related to me!',
    description: ''
  }
];
