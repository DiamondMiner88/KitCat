import Discord, { Permissions, TextChannel } from 'discord.js';
import { Command, Categories } from '../commands';
import { NOOP } from '../utils';
import { hasPermission } from '../utils';

export default class extends Command {
  trigger = 'purge';
  category = Categories.MODERATION;
  name = '🗑️ Purge';
  description = `Used to delete messages in bulk.`;
  usage = '[amount = 10]';
  guildOnly = true;
  unlisted = false;
  nsfw = false;

  invoke(message: Discord.Message, args: string[]): any {
    if (!hasPermission(message.member!, Permissions.FLAGS.MANAGE_MESSAGES))
      return message.channel.send('You do not have the permission to manage messages.');
    let purgeamnt = 10;
    if (!isNaN(Number(args[0]))) purgeamnt = Number(args[0]);
    if (purgeamnt > 100) message.channel.send(`The purging limit is 100`);
    else (message.channel as TextChannel).bulkDelete(purgeamnt).catch((err: any) => message.channel.send(err.message));
  }
}
