import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './_Command';

export class ServerInfo extends Command {
  constructor() {
    super();
    this.executor = 'serverinfo';
    this.category = 'util';
    this.displayName = 'Server Info';
    this.description = `Gives statu on this server.`;
    this.usage = '';
    this.guildOnly = false;
    this.unlisted = false;
    this.nsfw = false;
  }

  run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    const userCount = message.guild.members.cache.filter((member) => !member.user.bot).size;
    const botCount = message.guild.members.cache.filter((member) => member.user.bot).size;
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTitle('Server Information')
        .setColor(0xf9f5ea)
        .setDescription(`Information on **${message.guild.name}**.`)
        .setThumbnail(message.guild.iconURL())
        .addFields(
          {
            name: 'Server Size',
            value: `Users in server: ${userCount}\nBots in server: ${botCount}`
          },
          { name: 'Created At', value: new Date(message.guild.createdAt).toUTCString() }
        )
    );
  }
}
