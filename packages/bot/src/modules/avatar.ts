import { Collection, CommandInteraction, MessageEmbed, Snowflake } from 'discord.js';
import { Module, ModuleCategory, OptionString, OptionUser } from '../modules';

export default class extends Module {
  name = 'avatar';
  description = `Get a user's avatar. Leave options blank to see your own.`;
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

    const avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 });
    // EMBED COLOR
    const embed = new MessageEmbed()
      .setAuthor(`${user.tag} (${user.id})`)
      .setTitle('URL')
      .setURL(avatar)
      .setImage(avatar);
    interaction.reply(embed);
  }
}
