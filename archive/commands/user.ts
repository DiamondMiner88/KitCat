import Discord, { MessageEmbed } from 'discord.js';
import { Command, Categories } from '../commands';

export default class extends Command {
  trigger = 'user';
  category = Categories.MODERATION;
  name = 'User';
  description = "See a user's info.";
  usage = '{Mention | User ID}';
  guildOnly = true;
  unlisted = false;
  nsfw = false;

  async invoke(message: Discord.Message, args: string[]): Promise<any> {
    let t: Discord.GuildMember | undefined;
    try {
      t = message.mentions.members?.first() || (await message.guild?.members.fetch(args[0])) || message.member!;
      t?.fetch();
    } catch {
      return message.reply(`Couldn't find a user by \`${args[0]}\``);
    }
    if (!t) return message.reply(`Couldn't find a user by \`${args[0]}\``); 

    // TODO: Proper formatting on dates like "Joined: 2019/07/18 11:36:38 (UTC) (2 years ago)"
    const embed = new MessageEmbed()
      .addField(
        `❯ Member Details`,
        `• Nickname: \`${t.displayName}\`\n• Roles: ${t.roles.cache
          .map(r => `\`${r.name}\``)
          .join(', ')}\n• Joined: \`${t.joinedAt?.toDateString()}\``,
      )
      .addField(
        `❯ User Details`,
        `• ID: \`${t.id}\`\n• Username: \`${t.user.tag}\`\n• Created: \`${t.joinedAt?.toDateString()}\`\n• Status: \`${
          t.user.presence.status ?? 'None'
        }\``,
      )
      .setFooter(`Requested by ${message.member?.displayName} (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true }));
    message.reply(embed);
  }
}
