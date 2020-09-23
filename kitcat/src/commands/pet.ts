import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import fetch from 'node-fetch';

export class Pet extends Command {
  constructor() {
    super();
    this.executor = 'pet';
    this.category = 'fun';
    this.display_name = '🌭 Pet';
    this.description = `Get a photo/gif of kitties, dogs or other cute pets!`;
    this.usage = '{animal name | help}';
    this.guildOnly = false;
    this.unlisted = false;
    this.nsfw = false;
  }

  async run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    const { prefix } = settings;
    if (args.length === 0)
      return message.channel.send(`What pet do you want? \`${prefix}pet {animal}\``);
    const subcommand = args.shift();
    switch (subcommand) {
      case 'help':
        return message.channel.send(
          new Discord.MessageEmbed()
            .setColor(0xf9f5ea)
            .setTitle('Supported pets')
            .addField(':cat: Cat', `\`${prefix}pet cat\``)
            .addField(':dog: Doggo', `\`${prefix}pet dog\``)
        );
      case 'cat':
      case 'kitty':
        return message.channel.send('No cat images for now! Coming very soon!');
      case 'dog':
        const res = await fetch('https://dog.ceo/api/breeds/image/random');
        const json = await res.json();
        if (json.status !== 'success') {
          console.error('Dog image api error!');
          console.error(json);
          return message.channel.send(
            'An error occured with the dog api we used! This error was reported!'
          );
        }
        return message.channel.send(
          new Discord.MessageEmbed()
            .setColor(0xf9f5ea)
            .setTitle("Here's A Doggo For You!")
            .setImage(json.message)
        );
    }
  }
}
