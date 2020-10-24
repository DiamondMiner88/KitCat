import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';

const PEOPLE_HUG = [
  "https://media.giphy.com/media/4No2q4ROPXO7T6NWhS/giphy.gif",
  "https://media.giphy.com/media/vaXnKwhc4cAQU/giphy.gif",
  "https://media.giphy.com/media/PHZ7v9tfQu0o0/giphy.gif",
  "https://media.giphy.com/media/IRUb7GTCaPU8E/giphy.gif",
  "https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif",
  "https://media.giphy.com/media/sUIZWMnfd4Mb6/giphy.gif",
  "https://media.giphy.com/media/3bqtLDeiDtwhq/giphy.gif",
  "https://media.giphy.com/media/rSNAVVANV5XhK/giphy.gif",
  "https://media.giphy.com/media/VXP04aclCaUfe/giphy.gif",
  "https://media.giphy.com/media/1MI7djBqXTWrm/giphy.gif",
  "https://media.giphy.com/media/szxw88uS1cq4M/giphy.gif",
  "https://media.giphy.com/media/pN4sNFDT0vEwU/giphy.gif",
  "https://media.giphy.com/media/GJ5ktSzR3ffos/giphy.gif",
  "https://media.giphy.com/media/3o6ZsTopjMRVkJXAWI/giphy.gif",
  "https://media.giphy.com/media/jTSOClK7HBoMaVn5Hi/giphy.gif"
]

export class Hug extends Command {
  constructor() {
    super();
    this.executor = 'hug';
    this.category = 'fun';
    this.display_name = '🤗 Hug';
    this.description = 'Hug someone!';
    this.usage = '{Mention}';
    this.guildOnly = false;
    this.unlisted = false;
    this.nsfw = false;
  }

  run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    var mentions = message.mentions.users;
    if (mentions.size === 0) return message.channel.send("You didn't mention someone to hug!");
    var hug = new Discord.MessageEmbed().setImage(PEOPLE_HUG[Math.floor(Math.random() * PEOPLE_HUG.length)]);
    if (mentions.has(message.author.id)) {
      return message.channel.send("I see you need a hug!\n", hug);
    }
    if (mentions.size === 1 && message.mentions.has(message.client.user)) return message.channel.send("Thanks for the hug :blush:!\n", hug);
    var peoples: any[] = [];
    mentions.forEach((mention: any) => {
      if (!mentions.has(mention) && mention === message.client.user) peoples.push("**" + mention.username + "** (thanks! :blush:)")
      else if (!mentions.has(mention)) peoples.push("**" + mention.username + "**");
    });
    var people = peoples.join(', ');
    return message.channel.send(`:people_hugging: ${people} have/has been hugged by **${message.author.username}**!`, hug);
  }
}
