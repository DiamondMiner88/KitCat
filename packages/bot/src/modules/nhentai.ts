import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Module, ModuleCategory, OptionInteger } from '../modules';
import { API } from 'nhentai';
import { code, dateFormatStr, makeResponse, msToUI } from '../utils';
import dateFormat from 'dateformat';

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

    const tzOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const sinceUploaded = Date.now() + tzOffset - doujin.uploadDate.getTime();

    const info: [string, any, boolean?][] = [
      ['Pages', doujin.length],
      ['Favorites', doujin.favorites],
      ['Scanlator', doujin.scanlator || 'None', !doujin.scanlator],
      [
        'Uploaded',
        code(dateFormat(doujin.uploadDate.getTime() + tzOffset, dateFormatStr)) + `\n(${msToUI(sinceUploaded)} Ago)`,
        true
      ]
    ];
    if (doujin.tags.artists.length > 0)
      info.unshift(['Artists', doujin.tags.artists.map(author => `[${author.name}](${author.url})`), true]);

    // EMBED COLOR
    const embed = new MessageEmbed()
      .setAuthor('nhentai', 'https://i.imgur.com/uLAimaY.png')
      .setTitle(doujin.titles.pretty)
      .setURL(doujin.url)
      .setImage(doujin.cover.url)
      .addField('❯ Info', makeResponse(info), true);
    // TODO: Display groups/other tags

    if (doujin.tags.tags.length > 0)
      embed.addField('❯ Tags', doujin.tags.tags.map(t => `• ${t.name}`).join('\n'), true);

    interaction.reply(embed);
  }
}
