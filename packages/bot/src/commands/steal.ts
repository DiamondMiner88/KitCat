import Discord, { Permissions } from 'discord.js';
import { Command, Categories } from '../commands';

export default class extends Command {
  trigger = 'steal';
  category = Categories.UTIL;
  name = `Steal`;
  description = `Steal emojis from another server :)`;
  usage = '{Emojis | Emoji IDs | URL}';
  guildOnly = true;
  unlisted = false;
  nsfw = false;

  async invoke(message: Discord.Message, args: string[]): Promise<any> {
    if (!message.member!.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS))
      return message.channel.send('You need the permission to manage emojis before you can use this command!');

    if (args.length === 0) return message.channel.send("You didn't give me any emojis to steal!");

    const emojis = args.join(' ').matchAll(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/g);
    if (!emojis) return;
    const newEmojis = [];
    let prevTimout: NodeJS.Timeout | undefined;
    try {
      const notif = await message.channel.send(`Cloning emojis, please wait...`);
      for (const emoji of emojis) {
        prevTimout = setInterval(
          () => notif.edit('It looks like I got ratelimited while trying to create emojis! This may take an hour.'),
          10000
        );
        newEmojis.push(
          await message.guild!.emojis.create(
            `https://cdn.discordapp.com/emojis/${emoji[3]}.${emoji[1] ? 'gif' : 'png'}`,
            emoji[2],
            {
              reason: `Requested to be cloned by user ${message.author.tag}`
            }
          )
        );
        clearInterval(prevTimout);
      }
      await message.channel.send(`Successfully cloned all emojis: ${newEmojis.map(e => e.toString()).join(' ')}`, {
        split: true
      });
    } catch (error) {
      clearInterval(prevTimout!);
      if (error.message === 'Maximum number of emojis reached (50)')
        return message.channel.send(
          `I reached the max number of emojis for this server! Heres are the ones I managed to clone: ${newEmojis
            .map(e => e.toString())
            .join(' ')}`,
          { split: true }
        );

      message.channel.send(`An error occured: ${error}`);
    }
  }
}
