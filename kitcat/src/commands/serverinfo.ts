import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './_Command';
import dateformat from 'dateformat';

export class ServerInfo extends Command {
  constructor() {
    super();
    this.executor = 'serverinfo';
    this.category = 'util';
    this.display_name = 'Server Info';
    this.description = `Gives statu on this server.`;
    this.usage = '';
    this.guildOnly = true;
    this.unlisted = false;
    this.nsfw = false;
  }

  async run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    const guild = await message.guild.fetch();
    const timecreated = dateformat(message.guild.createdAt, 'UTC:yyyy/mm/dd HH:MM:ss "GMT"');

    return message.channel.send(
      new Discord.MessageEmbed()
        .setTitle(`__${message.guild.name}__`)
        .setColor(0xf9f5ea)
        .setThumbnail(message.guild.iconURL())
        .addField(`Approximate Members:`, guild.approximateMemberCount, true)
        .addField(`Created:`, timecreated, true)
    );
  }
}
