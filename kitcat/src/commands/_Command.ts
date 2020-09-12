import { Message } from 'discord.js';
import { IGuildSettings } from '../cache';

export class Command {
  executor: string;
  category: ICategories;
  displayName: string | undefined;
  description: string | undefined;
  usage: string | undefined;
  guildOnly: boolean | undefined;
  unlisted: boolean | undefined;
  nsfw: boolean | undefined;

  protected getUsage(settings: IGuildSettings) {
    return `\`${settings.prefix}${this.executor}${this.usage != null ? ' ' + this.usage : ''}\``;
  }

  getCommandHelp(settings: IGuildSettings): [string, string] {
    return [
      this.displayName != null ? this.displayName : this.executor,
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
