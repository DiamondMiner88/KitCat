import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';

export class CustomImg extends Command {
  constructor() {
    super();
    this.executor = 'custom-img';
    this.category = 'fun';
    this.display_name = '📷 Photo Commands';
    this.description = 'Image commands to make kool custom photos.';
    this.usage = 'help';
    this.guildOnly = false;
    this.unlisted = false;
    this.nsfw = false;
  }

  run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    const prefix = settings ? settings.prefix : 'k!';
    if (args.length === 0)
      return message.channel.send(
        `You didn't provide any image command to run! Do \`${prefix}${this.executor} help\` for a list!`
      );
    const subcommand = args.shift();
    switch (subcommand) {
      case 'help':
        return message.channel.send(
          new Discord.MessageEmbed()
            .setTitle('Image Commands')
            .setColor(0xf9f5ea)
            .addField(
              'Minecraft Achievement',
              `Make custom Minecraft achievement.\n\`${prefix}${this.executor} minecraft {achievement}\``
            )
        );
      case 'mc':
        return message.channel.send(
          `https://minecraftskinstealer.com/achievement/3/Achievement%20Get%21/${encodeURIComponent(
            args.join(' ')
          )}`
        );
    }
  }
}
