import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';

export class Purge extends Command {
  constructor() {
    super();
    this.executor = 'purge';
    this.category = 'moderation';
    this.display_name = '🗑️ Purge';
    this.description = `Used to delete messages in bulk.`;
    this.usage = '{amount: default = 5}';
    this.guildOnly = true;
    this.unlisted = false;
    this.nsfw = false;
  }

  run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    if (message.channel.type === 'dm') return; // Avoid TS errors

    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      message.channel.send('You do not have the permission to manage messages.');
      return;
    }
    let purgeamnt = 5;
    if (!isNaN(Number(args[0]))) purgeamnt = Number(args[0]);
    if (purgeamnt > 100) {
      message.channel.send(`The purging limit is 100`);
    } else {
      message.channel
        .bulkDelete(purgeamnt)
        .then((messages: Discord.Collection<Discord.Snowflake, Discord.Message>) => {
          message.channel
            .send(`Purged ${messages.size} messages, deleting this in 2 seconds.`)
            .then(msg => {
              msg
                .delete({
                  timeout: 2000
                })
                .catch(() => {});
            });
        })
        .catch((err: any) => message.channel.send(err.message));
    }
  }
}
