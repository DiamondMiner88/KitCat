import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './_Command';

export class Ping extends Command {
  constructor() {
    super();
    this.executor = 'ping';
    this.category = 'kitcat';
    this.displayName = `Bot's Ping`;
    this.description = `Gets my latency.`;
    this.usage = '';
    this.guildOnly = false;
    this.unlisted = false;
    this.nsfw = false;
  }

  async run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    let m = await message.channel.send('Ping?');
    m.edit(
      `Pong! Round trip latency is ${
        m.createdTimestamp - message.createdTimestamp
      }ms. One-way API Latency is ${Math.round(message.client.ws.ping)}ms`
    );
  }
}
