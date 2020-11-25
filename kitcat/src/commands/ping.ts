import Discord from 'discord.js';
import { Command } from '../commands';

export default class Ping extends Command {
    executor = 'ping';
    category = 'kitcat';
    display_name = `Bot's Ping`;
    description = `Gets my latency.`;
    usage = '';
    guildOnly = false;
    unlisted = false;
    nsfw = false;

    async run(message: Discord.Message): Promise<void> {
        const m = await message.channel.send('Ping?');
        m.edit(
            `Pong! Round trip latency is ${
                m.createdTimestamp - message.createdTimestamp
            }ms. One-way API Latency is ${Math.round(message.client.ws.ping)}ms`
        );
    }
}
