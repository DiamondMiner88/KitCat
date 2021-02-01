import Discord from 'discord.js';
import { Command, Categories } from '../commands';
import { prisma } from '../db';

// TODO: temp snipe enable until i fix dashboard
export default class EnableSnipe extends Command {
  trigger = 'enablesnipe';
  category = Categories.FUN;
  name = '';
  description = '';
  usage = '';
  guildOnly = true;
  unlisted = true;
  nsfw = false;

  async invoke(message: Discord.Message): Promise<any> {
    await prisma.guildSettings.upsert({
      create: {
        id: message.guild!.id,
        snipingEnabled: true,
      },
      update: {
        snipingEnabled: true,
      },
      where: {
        id: message.guild!.id,
      },
    });
    message.reply('Done.');
  }
}
