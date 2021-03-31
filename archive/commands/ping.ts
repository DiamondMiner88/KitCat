import Discord from 'discord.js';
import { Command, Categories } from '../commands';

export default class extends Command {
  trigger = 'ping';
  category = Categories.KITCAT;
  name = `Ping`;
  description = `Gets my latency.`;
  usage = '';
  guildOnly = false;
  unlisted = false;
  nsfw = false;

  async invoke(message: Discord.Message): Promise<void> {
    const m = await message.channel.send('Not happening.');
    const text = `Pong! Round trip latency is ${m.createdTimestamp - message.createdTimestamp}ms. Heartbeat is ${Math.round(
      message.client.ws.ping,
    )}ms`;
    message.client.setTimeout(() => m.edit(text), 5000);
  }
}
