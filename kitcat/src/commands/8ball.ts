import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';

const eightball_config = {
  replies: [
    'It is certain.',
    'It is decidedly so. ',
    'Without a doubt. ',
    'Yes - definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    "Don't count on it.",
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.'
  ]
};

export class EightBall extends Command {
  constructor() {
    super();
    this.executor = '8ball';
    this.category = 'fun';
    this.display_name = '🎱 8Ball';
    this.description = 'Ask the 8ball a question, and it will give you an answer.';
    this.usage = '{question}';
    this.guildOnly = false;
    this.unlisted = false;
    this.nsfw = false;
  }

  run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    if (args.length === 0) message.channel.send(`You didn't ask a question! ;(`);
    else {
      const embed = new Discord.MessageEmbed()
        .setColor(0xf9f5ea)
        .setTitle('8Ball')
        .addField(
          '> ' + args.join(' '),
          eightball_config.replies[Math.floor(Math.random() * eightball_config.replies.length)]
        );
      message.channel.send(embed);
    }
  }
}
