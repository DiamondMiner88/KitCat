import { Message } from 'discord.js';
import { Command, Categories } from '../commands';
import { getGuildSettings } from '../db';
import { hasPermission } from '../util/utils';
import { snipeCache, StoredMessage } from './snipe';

export default class Snipe extends Command {
  trigger = 'unsnipe';
  category = Categories.UTIL;
  name = '︻デ═一 Unsnipe';
  description = "Prevent your deleted message from being sniped. This does not delete a message already sniped. Contact your server's moderators.";
  usage = '';
  guildOnly = true;
  unlisted = false;
  nsfw = false;

  async invoke(message: Message): Promise<any> {
    const settings = await getGuildSettings(message.guild!);
    if (!settings.snipingEnabled) {
      if (hasPermission(message.member!))
        return message.reply('Sniping is disabled for this server. You can enable it on the dashboard! `/dashboard`');
      else return message.reply('Sorry, but sniping is disabled on this server!');
    }

    const msg = snipeCache.get<StoredMessage>(message.channel.id);
    if (!msg) return message.reply('I could not find a deleted message!');
    if (msg.authorId !== message.author.id && msg.authorId) return message.reply("The deleted message wasn't sent by you so I cannot unsnipe it");
    snipeCache.del(message.channel.id);
    message.reply('Done.');
  }
}
