import { Collection, CommandInteraction, MessageEmbed, Snowflake } from 'discord.js';
import { Module, ModuleCategory, OptionString, OptionUser } from '../modules';
import { code, link, makeKVList, timestamp } from '../utils';

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

    // EMBED COLOR
    const embed = new MessageEmbed()
      .setThumbnail(user.displayAvatarURL({ dynamic: true, format: 'png', size: 64 }))
      .addField(
        `❯ User`,
        makeKVList(['ID', user.id], ['Username', user.tag], ['Created', timestamp(user.createdAt), true])
      );

    if (interaction.guild) {
      const member = await interaction.guild.members.fetch(user.id).catch(() => undefined);
      if (member) {
        embed.setColor(member.displayHexColor).addField(
          `❯ Member`,
          makeKVList(
            ['Nickname', member.nickname ? code(member.nickname) : 'None'],
            [
              'Roles',
              member.roles.cache.size > 1
                ? member.roles.cache
                    .filter(r => r.name !== '@everyone' && !r.managed)
                    .map(r => `\`${r.name}\``)
                    .join(', ')
                : 'None',
              true
            ],
            ['Joined', timestamp(member.joinedAt as Date), true],
            [
              'Color',
              link(code(member.displayHexColor), `https://www.color-hex.com/color/${member.displayHexColor.slice(1)}`),
              true,
              !member.roles.color
            ],
            [
              'Boosting',
              member.premiumSinceTimestamp ? `Since ${timestamp(member.premiumSinceTimestamp)}` : 'Not boosting',
              true,
              !member.premiumSinceTimestamp
            ]
          )
        );
      }
    }
    interaction.reply({ embeds: [embed] });
  }
}
