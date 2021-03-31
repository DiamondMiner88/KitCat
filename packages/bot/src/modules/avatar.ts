import { Collection, CommandInteraction, MessageEmbed } from 'discord.js';
import { Module, ModuleCategory } from '../modules';

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
      options: undefined,
    },
    {
      type: 'STRING',
      name: 'id',
      description: 'Their user id.',
      required: false,
      default: undefined,
      choices: undefined,
      options: undefined,
    },
    {
      type: 'STRING',
      name: 'tag',
      description: 'Their user tag. Only works for server members. (Ex. user#0001)',
      required: false,
      default: undefined,
      choices: undefined,
      options: undefined,
    },
  ];

  async invoke(interaction: CommandInteraction, options: Collection<string, any>) {
    const userParam = options.get('user')?.user;
    const idParam = options.get('id');
    const tagParam = options.get('tag');
    const splitTag = tagParam?.split('#');
    let user =
      userParam || idParam || tagParam
        ? userParam ??
          (idParam ? await interaction.client.users.fetch(idParam).catch(() => undefined) : undefined) ??
          (tagParam ? await interaction.guild?.members.fetch({ query: splitTag[0], limit: 10 }).catch(() => undefined) : undefined)
        : interaction.member?.user;

    if (user instanceof Collection) user = user.find(m => m.user.discriminator === splitTag[1])?.user ?? user.first()?.user;
    if (!user) return interaction.reply('Could not find that user!');

    const avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 2048 });
    // EMBED COLOR
    const embed = new MessageEmbed().setAuthor(`${user.tag} (${user.id})`).setTitle('URL').setURL(avatar).setImage(avatar);
    interaction.reply(embed);
  }
}
