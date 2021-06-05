import dateFormat from 'dateformat';
import { Collection, CommandInteraction, MessageEmbed, Snowflake } from 'discord.js';
import { Module, ModuleCategory, OptionString, OptionUser } from '../modules';
import { dateFormatStr, msToUI } from '../utils';

export default class extends Module {
  name = 'user';
  description = `Display Discord statistics about the user.`;
  category = ModuleCategory.UTILITY;
  guildOnly = false;

  options: any = [
    {
      type: 'USER',
      name: 'user',
      description: 'Mention the user.',
      required: false,
      default: undefined,
      choices: undefined,
      options: undefined
    },
    {
      type: 'STRING',
      name: 'id',
      description: 'Their user id.',
      required: false,
      default: undefined,
      choices: undefined,
      options: undefined
    },
    {
      type: 'STRING',
      name: 'tag',
      description: 'Their user tag. Only works for server members. (Ex. user#0001)',
      required: false,
      default: undefined,
      choices: undefined,
      options: undefined
    }
  ];

  async invoke(
    interaction: CommandInteraction,
    { user: userParam, id: idParam, tag: tagParam }: { user?: OptionUser; id?: OptionString; tag?: OptionString }
  ): Promise<any> {
    const splitTag = tagParam?.value.split('#');
    let user =
      userParam?.user || idParam?.value || splitTag
        ? userParam?.user ??
          (idParam
            ? await interaction.client.users.fetch(idParam.value as Snowflake).catch(() => undefined)
            : undefined) ??
          (splitTag
            ? await interaction.guild?.members.fetch({ query: splitTag[0], limit: 10 }).catch(() => undefined)
            : undefined)
        : interaction.user;

    if (user instanceof Collection)
      user = user.find(m => m.user.discriminator === splitTag![1])?.user ?? user.first()?.user;
    if (!user) return interaction.reply('Could not find that user!');

    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

    const sinceCreateElapsed = Date.now() + timezoneOffset - user.createdTimestamp;
    const createdAt = `\`${dateFormat(user.createdTimestamp, dateFormatStr)} (UTC)\` (${msToUI(
      sinceCreateElapsed
    )} Ago)`;

    // EMBED COLOR
    const embed = new MessageEmbed()
      .setThumbnail(user.displayAvatarURL({ dynamic: true, format: 'png', size: 64 }))
      .addField(`❯ User`, `• ID: \`${user.id}\`\n• Username: \`${user.tag}\`\n• Created: ${createdAt}`);

    if (interaction.guild) {
      const member = await interaction.guild.members.fetch(user.id).catch(() => undefined);
      if (member) {
        embed.setColor(member.displayHexColor);
        const joinElapsed = Date.now() + timezoneOffset - (member.joinedTimestamp ?? 0);
        const joinedAt = member.joinedTimestamp
          ? `\`${dateFormat(member.joinedTimestamp, dateFormatStr)} (UTC)\` (${msToUI(joinElapsed)} Ago)`
          : 'unknown';
        const nickname = member.nickname ? '`' + member.nickname + '`' : 'No nickname';
        const boostingElapsed = Date.now() + timezoneOffset - (member.premiumSinceTimestamp ?? 0);
        const boostingSince = member.premiumSinceTimestamp
          ? `Since \`${dateFormat(member.premiumSinceTimestamp, dateFormatStr)} (UTC)\` (${msToUI(
              boostingElapsed
            )} Ago)`
          : 'Not boosting';
        const roles =
          member.roles.cache.size > 1
            ? member.roles.cache
                .filter(r => r.name !== '@everyone')
                .map(r => `\`${r.name}\``)
                .join(', ')
            : 'None';
        embed.addField(
          `❯ Member`,
          `• Nickname: ${nickname}\n• Roles: ${roles}\n• Joined: ${joinedAt}\n• Display [Color](https://www.color-hex.com/color/${member.displayHexColor.slice(
            1
          )}): \`${member.displayHexColor}\`\n• Boost: ${boostingSince}`
        );
      }
    }
    interaction.reply(embed);
  }
}
