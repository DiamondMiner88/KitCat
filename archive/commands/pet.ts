import Discord from 'discord.js';
import { Command, Categories } from '../commands';
import fetch from 'node-fetch';
import { logger } from '../logging';

export default class extends Command {
  trigger = 'pet';
  category = Categories.FUN;
  name = '🌭 Pet';
  description = `Get a photo/gif of kitties, dogs or other cute pets!`;
  usage = '{animal name | help}';
  guildOnly = false;
  unlisted = false;
  nsfw = false;

  async invoke(message: Discord.Message, args: string[]): Promise<any> {
    const prefix = 'k!';
    if (args.length === 0) return message.channel.send(`What pet do you want? \`${prefix}pet {animal}\``);
    const subcommand = args.shift();
    switch (subcommand) {
      case 'help': {
        return message.channel.send(
          new Discord.MessageEmbed()
            .setColor(0xf9f5ea)
            .setTitle('Supported pets')
            .addField(':cat: Cat', `\`${prefix}pet cat\``)
            .addField(':dog: Doggo', `\`${prefix}pet dog\``),
        );
      }
      case 'cat':
      case 'kitty': {
        return message.channel.send(new Discord.MessageEmbed().setTitle(`Here's a cat for you!`).setImage('https://cataas.com/cat'));
      }
      case 'dog': {
        const res = await fetch('https://dog.ceo/api/breeds/image/random');
        const json = await res.json();
        if (json.status !== 'success') {
          logger.error(json);
          return message.channel.send('An error occured with the dog api we used! This error was reported!');
        }
        return message.channel.send(new Discord.MessageEmbed().setColor(0xf9f5ea).setTitle(`Here's A doggo For You!`).setImage(json.message));
      }
    }
  }
}
