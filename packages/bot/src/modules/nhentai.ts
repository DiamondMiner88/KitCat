import { Collection, CommandInteraction, MessageEmbed } from 'discord.js';
import { Module, ModuleCategory } from '../modules';
import { API } from 'nhentai';
import { msToUI } from '../utils';
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
      options: undefined,
    },
  ];

  async invoke(interaction: CommandInteraction, options: Collection<string, any>) {
    const doujin = await api.fetchDoujin(options.get('id')).catch(() => undefined);

    if (!doujin) return interaction.reply(`Your query returned no results.`);

    const artists = `• Artists: ${doujin.tags.artists.map(author => `[${author.name}](${author.url})`)}`;

    const formatString = 'yyyy-mm-dd HH:MM:ss';
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const sinceUploaded = Date.now() + timezoneOffset - doujin.uploadDate.getTime();

    // EMBED COLOR
    const embed = new MessageEmbed()
      .setAuthor('nhentai', 'https://i.imgur.com/uLAimaY.png')
      .setTitle(doujin.titles.pretty)
      .setURL(doujin.url)
      .setImage(doujin.cover.url)
      .addField(
        '❯ Info',
        `${doujin.tags.artists.length > 0 ? artists : ''}\n• Scanlator: ${doujin.scanlator || 'None'}\n• Length: ${
          doujin.length
        } Pages\n• Favorites: ${doujin.favorites}\n• Uploaded: ${dateFormat(doujin.uploadDate.getTime() + timezoneOffset, formatString)} (${msToUI(
          sinceUploaded,
        )} Ago)`,
        true,
      );
    // TODO: Display groups/other tags

    if (doujin.tags.tags.length > 0) embed.addField('❯ Tags', '• ' + doujin.tags.tags.map(t => `${t.name} (${t.count})`).join('\n• '), true);

    interaction.reply(embed);
  }
}
