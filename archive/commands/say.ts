import Discord from 'discord.js';
import { Command, Categories } from '../commands';

export default class extends Command {
  trigger = 'say';
  category = Categories.KITCAT;
  name = `Say`;
  description = `Say something anonymously.`;
  usage = '{message}';
  guildOnly = false;
  unlisted = true;
  nsfw = false;

  async invoke(message: Discord.Message, args: string[]): Promise<any> {
    if (message.guild?.id !== '752212085672247296') return; // pcms server only
    if (args.length === 0) return message.reply(`I can't send a blank message!`);
    await message.delete();
    message.channel.send(args.join(' '));
  }
}
