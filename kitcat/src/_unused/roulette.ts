import Discord, { User } from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';

export class Roulette extends Command {
  constructor() {
    super();
    this.executor = 'roulette';
    this.category = 'games';
    this.display_name = '🔫 Roulette';
    this.description = 'Play Russian Roulette with your friends (if you have any) in Discord.';
    this.usage = '{Mentions of users to play with}';
    this.guildOnly = false;
    this.unlisted = false;
    this.nsfw = false;
  }

  run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    var mentioned_users = message.mentions.users;  // Just a variable to gold the mentioned users in the message
    if (mentioned_users.size === 0) return message.channel.send('Mention people to play with!');
    var users: User[] = [];  // An array filled with users that are mentioned
    mentioned_users.forEach((user: any) => {
      if (!mentioned_users.has(user)) users.push(user);
    });
    // if (users.length === 1 && users[0] === message.author) return message.channel.send('Why are you tring to play russian roulette with yourself?')
    if (!users.includes(message.author)) users.push(message.author)
    var playing: User[];
    message.channel.send(`${users.join(', ')} respond with \`accept ${message.author.username}\` to join the game.`);
    message.channel.awaitMessages((m: any) => users.includes(m.author), { max: users.length, time: 300000, errors: ["time"] })
      .then((collected: any) => {
        // playing.push()
        if (playing !== undefined && !playing.includes(collected.author) && collected.content.toLowerCase() === `accept ${message.author.username}`) {
          playing.push(collected.message.author)
        }
      });
  }
}
