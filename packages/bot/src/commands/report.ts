import Discord, { MessageEmbed, TextChannel } from 'discord.js';
import { Command, Categories } from '../commands';

export default class extends Command {
  trigger = 'report';
  category = Categories.MODERATION;
  name = 'Report';
  description = 'Report a user.';
  usage = '{Mention | User ID} {Reason}';
  guildOnly = true;
  unlisted = true;
  nsfw = false;

  async invoke(message: Discord.Message, args: string[]): Promise<any> {
    if (message.guild?.id !== '752212085672247296') return; // TODO: guild-specific report channel id

    if (args.length < 2) message.reply('Invalid arguments!');

    let t: Discord.GuildMember | undefined;
    try {
      t = await (message.mentions.members?.first() || message.guild?.members.fetch(args[0]));
    } catch {
      return message.reply(`Couldn't find a user by \`${args[0]}\``);
    }
    if (!t) return message.reply(`Couldn't find a user by \`${args[0]}\``);
    args.shift();

    const embed = new MessageEmbed()
      .setTitle('❯ New Report')
      .setAuthor(`${t.user.tag} (${t.id})`, t.user.displayAvatarURL({ dynamic: true }))
      .setDescription(args.join(' '))
      .setFooter(
        `Filed by ${message.author.tag} (${message.author.id})`,
        message.author.displayAvatarURL({ dynamic: true })
      );
    const channel = message.guild.channels.cache.get('766051990178365451') as TextChannel;
    channel
      ?.send(embed)
      .then(async () => (await message.reply('Success!')) && message.delete())
      .catch(() => message.reply('Could not file report!') && message.delete());
  }
}
