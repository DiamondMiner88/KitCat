import Discord from 'discord.js';
import { Command, Categories } from '../commands';
import dateformat from 'dateformat';
import { GuildMessage } from '../types';

export default class ServerInfo extends Command {
  trigger = 'serverinfo';
  category = Categories.UTIL;
  name = 'Server Info';
  description = `Gives statu on this server.`;
  usage = '';
  guildOnly = true;
  unlisted = false;
  nsfw = false;

  async invoke(message: GuildMessage): Promise<any> {
    const timecreated = dateformat(message.guild.createdAt, 'UTC:yyyy/mm/dd HH:MM:ss "GMT"');

    const embed = new Discord.MessageEmbed()
      .setTitle(`__${message.guild.name}__`)
      .setColor(0xf9f5ea)
      .addField(`Member count:`, message.guild.memberCount, true)
      .addField(`Created:`, timecreated, true);
    if (message.guild.iconURL()) embed.setThumbnail(message.guild.iconURL()!);
    return message.channel.send(embed);
  }
}
