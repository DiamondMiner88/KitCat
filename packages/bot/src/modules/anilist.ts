import { Collection, CommandInteraction, MessageEmbed } from 'discord.js';
import { Module, ModuleCategory } from '../modules';
import { readFileSync } from 'fs';
import fetch from 'node-fetch';

export default class extends Module {
  name = 'anilist';
  description = 'Search and display a media entry on AniList.';
  category = ModuleCategory.UTILITY;
  guildOnly = false;

  options: any = [
    {
      type: 'STRING',
      name: 'query',
      description: 'Search by name.',
      required: true,
      default: undefined,
      choices: undefined,
      options: undefined,
    },
    {
      type: 'STRING',
      name: 'type',
      description: 'Package name.',
      required: false,
      default: undefined,
      choices: [
        {
          name: 'Any anime',
          value: 'ANIME',
        },
        {
          name: 'Manga',
          value: 'MANGA',
        },
        {
          name: 'TV',
          value: 'TV',
        },
        {
          name: 'TV Short',
          value: 'TV_SHORT',
        },
        {
          name: 'Movie',
          value: 'MOVIE',
        },
        {
          name: 'Special',
          value: 'SPECIAL',
        },
        {
          name: 'OVA (Original video animation)',
          value: 'OVA',
        },
        {
          name: 'ONA (Original Net Animation)',
          value: 'ONA',
        },
        {
          name: 'Music Video',
          value: 'MUSIC',
        },
        {
          name: 'Light Novel',
          value: 'NOVEL',
        },
        {
          name: 'One shot',
          value: 'ONE_SHOT',
        },
      ],
      options: undefined,
    },
  ];

  aniListStatuses: Record<string, string> = {
    FINISHED: 'Finished',
    RELEASING: 'Releasing',
    NOT_YET_RELEASED: 'Not yet released',
    CANCELLED: 'Cancelled',
    HIATUS: 'Hiatus',
  };

  aniListFormats: Record<string, string> = {
    TV: 'TV',
    TV_SHORT: 'TV Short',
    MOVIE: 'Movie',
    SPECIAL: 'Special',
    OVA: 'OVA (Original Video Animation)',
    ONA: 'ONA (Original Net Animation)',
    MUSIC: 'Music Video',
    MANGA: 'Manga',
    NOVEL: 'Novel',
    ONE_SHOT: 'One Shot',
  };

  queryTemplate = readFileSync(__dirname + '/../gql/AnilistMediaQuery.gql', 'utf-8');

  async invoke(interaction: CommandInteraction, options: Collection<string, any>) {
    const query_type = options.get('type');
    let result = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: this.queryTemplate,
        variables: {
          query: options.get('query'),
          type: query_type === 'MANGA' || query_type === 'ANIME' ? query_type : undefined,
          format: query_type !== 'MANGA' && query_type !== 'ANIME' ? query_type : undefined,
        },
      }),
    })
      .then(r => r.json())
      .catch(e => e.message);

    if (typeof result === 'string' || result.errors || result.error) {
      if (result.errors[0]?.status === 404) return interaction.reply(`No results returned matching your query (${options.get('query')}).`);

      const msg = typeof result === 'string' ? result : result.error.errors.map((error: any) => `\`${error.message}\``).join(', ');
      return interaction.reply(`An error(s) occured: ${msg}`);
    }

    const {
      isAdult,
      startDate,
      endDate,
      rankings,
      externalLinks,
      title: { english, romaji, native },
      meanScore,
      averageScore,
      format,
      status,
      siteUrl,
      coverImage: { large: coverImage, color },
      description: rawDescription,
    } = result.data.Media;

    const title = romaji ?? english ?? native;

    if (isAdult) return interaction.reply(`The media returned (${title}) is adult. Please run this command in an nsfw channel to see more info`);

    let description = rawDescription.split('\n')[0].slice(0, 500);
    if (description.length === 500) description += '...';

    const embed = new MessageEmbed()
      .setAuthor('AniList', 'https://anilist.co/img/icons/android-chrome-512x512.png')
      .setTitle(`${title} (${this.aniListFormats[format]})`)
      .setURL(siteUrl)
      .setColor(color)
      .setImage(coverImage)
      .setDescription(description)

      .addField(
        '❯ Status',
        `• ${this.aniListStatuses[status]}\n• Start Date: ${startDate.year ?? '?'}-${startDate.month ?? '?'}-${startDate.day ?? '?'}\n• End Date: ${
          endDate.year ?? '?'
        }-${endDate.month ?? '?'}-${endDate.day ?? '?'}`,
        true,
      );

    if (externalLinks.length > 0)
      embed.addField('❯ External Links', '• ' + externalLinks.map((l: any) => `[${l.site}](${l.url})`).join('\n• '), true);
    // TODO: Use the rankings property, not just score
    embed.addField('❯ Rankings', `• Average Score: ${averageScore ?? 'Unknown'}\n• Mean Score ${meanScore ?? 'Unknown'}`, true);

    interaction.reply(embed);
  }
}

/*
      "rankings": [
        {
          "rank": 413,
          "type": "RATED",
          "year": null,
          "season": null,
          "allTime": true
        },
        {
          "rank": 214,
          "type": "POPULAR",
          "year": null,
          "season": null,
          "allTime": true
        },
        {
          "rank": 21,
          "type": "RATED",
          "year": 2018,
          "season": null,
          "allTime": false
        },
        {
          "rank": 14,
          "type": "POPULAR",
          "year": 2018,
          "season": null,
          "allTime": false
        }
      ],
*/
