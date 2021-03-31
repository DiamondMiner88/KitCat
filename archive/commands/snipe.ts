// Generally, we allow messages to be stored off platform (cache, database, etc) for 30 days, so long as they're encrypted at rest and automatically deleted after that time passes
// This can happen silently, so server owners can consent to this on their server's behalf
// Each individual user isn't required to consent--it'd make essential moderation actions near impossible, after all
// kadybat - DiscordAPI 2021-01-28: https://discord.com/channels/613425648685547541/696891424041598978/804480355124903996

import { Message, MessageEmbed, PartialMessage } from 'discord.js';
import NodeCache from 'node-cache';
import { Command, Categories } from '../commands';
import { getGuildSettings } from '../db';
import { hasPermission } from '../util/utils';

// Channel Id -> StoredMessage
export const snipeCache = new NodeCache();

export class StoredMessage {
  content: string | null;
  avatarURL?: string;
  tag?: string;
  createdAt: Date;
  authorId?: string;

  constructor(message: Message | PartialMessage) {
    this.content = message.content;
    this.avatarURL = message.author?.displayAvatarURL({ format: 'png', dynamic: true });
    this.tag = message.author?.tag;
    this.createdAt = message.createdAt;
    this.authorId = message.author?.id;
  }
}

export default class Snipe extends Command {
  trigger = 'snipe';
  category = Categories.UTIL;
  name = '︻デ═一 Snipe';
  description = 'Bring back the most recently deleted message.';
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
    if (!msg || !msg.content) return message.reply('I could not find a deleted message!');

    message.reply(
      `<@${msg.authorId}>`,
      new MessageEmbed()
        .setAuthor(msg.tag, msg.avatarURL)
        .setDescription(msg.content)
        .setTimestamp(msg.createdAt)
        .setFooter('k!unsnipe to prevent your messages from being sniped in the future!'),
    );
    snipeCache.del(message.channel.id);
  }
}

export function addMessageToSnipeCache(message: Message | PartialMessage) {
  if (!message.guild || message.author?.bot) return;
  snipeCache.set(message.channel.id, new StoredMessage(message), 3600 /* 1 hour */);
}
