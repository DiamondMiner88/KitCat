import Discord from 'discord.js';
import { Command, Categories } from '../commands';

const eightballReplies = [
  'It is certain.',
  'https://i.redd.it/qh7mgkucu2y21.jpg',
  'Without a doubt. ',
  'Yes - definitely.',
  'You may rely on it.',
  'As I see it, yes.',
  'Outlook good.',
  'Signs point to yes.',
  `Don't count on it.`,
  'My reply is no.',
  'My sources say no.',
  'Outlook not so good.',
  'x to doubt',
];

export default class extends Command {
  trigger = '8ball';
  category = Categories.FUN;
  name = '🎱 8Ball';
  description = 'Ask the 8ball a question, and it will give you an answer.';
  usage = '{question}';
  guildOnly = false;
  unlisted = false;
  nsfw = false;

  invoke(message: Discord.Message, args: string[]): any {
    if (args.length === 0) return message.channel.send(`Wheres the question? `);
    message.reply(eightballReplies[Math.floor(Math.random() * eightballReplies.length)]);
  }
}
