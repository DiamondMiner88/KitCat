import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Module, ModuleCategory, OptionInteger } from '../modules';
import { API } from 'nhentai';
import { link, makeKVList, timestamp } from '../utils';

const api = new API();

export default class extends Module {
  name = 'nhentai';
  description = 'Lookup a doujin from nhentai and display it.';
  category = ModuleCategory.UTILITY;
  guildOnly = false;
  nsfw = true;

  options: any = [
    {
      type: 'INTEGER',
      name: 'id',
      description: "A 1-6 digit number that represents the doujin's id.",
      required: true,
      default: undefined,
      choices: undefined,
      options: undefined
    }
  ];

  async invoke(interaction: CommandInteraction, { id: { value } }: { id: OptionInteger }): Promise<any> {
    const doujin = await api.fetchDoujin(value).catch(() => undefined);
    if (!doujin) return interaction.reply(`Your query returned no results.`);

    // EMBED COLOR
    const embed = new MessageEmbed()
      .setAuthor('nhentai', 'https://i.imgur.com/uLAimaY.png')
      .setTitle(doujin.titles.pretty)
      .setURL(doujin.url)
      .setImage(doujin.cover.url)
      .addField(
        '❯ Info',
        makeKVList(
          [
            'Artists',
            doujin.tags.artists.map(author => link(author.name, author.url)).join(', '),
            true,
            doujin.tags.artists.length > 0
          ],
          ['Pages', doujin.length],
          ['Favorites', doujin.favorites],
          ['Scanlator', doujin.scanlator || 'None', !doujin.scanlator],
          ['Uploaded', timestamp(doujin.uploadDate, { newLine: true }), true]
        ),
        true
      );
    // TODO: Display groups/other tags

    if (doujin.tags.tags.length > 0)
      embed.addField('❯ Tags', doujin.tags.tags.map(t => `• ${t.name}`).join('\n'), true);

    interaction.reply({ embeds: [embed] });
  }
}
