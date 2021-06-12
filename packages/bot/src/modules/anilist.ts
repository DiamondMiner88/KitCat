import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Module, ModuleCategory, OptionString } from '../modules';
import { readFileSync } from 'fs';
import fetch from 'node-fetch';
import { link, makeKVList, makeList } from '../utils';

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
      options: undefined
    },
    {
      type: 'STRING',
      name: 'type',
      description: 'Package name.',
      required: false,
      default: undefined,
      choices: [
        {
          name: 'Anime (Any format)',
          value: 'ANIME'
        },
        {
          name: 'Manga',
          value: 'MANGA'
        },
        {
          name: 'TV',
          value: 'TV'
        },
        {
          name: 'TV Short',
          value: 'TV_SHORT'
        },
        {
          name: 'Movie',
          value: 'MOVIE'
        },
        {
          name: 'Special',
          value: 'SPECIAL'
        },
        {
          name: 'OVA (Original video animation)',
          value: 'OVA'
        },
        {
          name: 'ONA (Original Net Animation)',
          value: 'ONA'
        },
        {
          name: 'Music Video',
          value: 'MUSIC'
        },
        {
          name: 'Light Novel',
          value: 'NOVEL'
        },
        {
          name: 'One shot',
          value: 'ONE_SHOT'
        }
      ],
      options: undefined
    }
  ];

  aniListStatuses: Record<string, string> = {
    FINISHED: 'Finished',
    RELEASING: 'Releasing',
    NOT_YET_RELEASED: 'Not yet released',
    CANCELLED: 'Cancelled',
    HIATUS: 'Hiatus'
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
    ONE_SHOT: 'One Shot'
  };

  queryTemplate = readFileSync(__dirname + '/../gql/AnilistMediaQuery.gql', 'utf-8');

  async invoke(
    interaction: CommandInteraction,
    { query: queryParam, type: typeParam }: { query: OptionString; type: OptionString }
  ): Promise<any> {
    const { value: query } = queryParam ?? {};
    const { value: type } = typeParam ?? {};
    const result = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query: this.queryTemplate,
        variables: {
          query: query,
          type: type === 'MANGA' || type === 'ANIME' ? type : undefined,
          format: type !== 'MANGA' && type !== 'ANIME' ? type : undefined
        }
      })
    })
      .then(r => r.json())
      .catch(e => e.message);

    if (typeof result === 'string' || result.errors || result.error) {
      if (result.errors[0]?.status === 404)
        return interaction.reply(`No results returned matching your query (${query}).`);

      const msg =
        typeof result === 'string'
          ? result
          : result.error.errors.map((error: any) => `\`${error.message}\``).join(', ');
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
      description: rawDescription
    } = result.data.Media;

    const title = romaji ?? english ?? native;

    if (isAdult)
      return interaction.reply(
        `The title returned (${title}) is adult. Please run this command in an nsfw channel to see more info.`
      );

    let description = rawDescription.split('\n')[0].slice(0, 500);
    if (description.length === 500) description += '...';

    const start =
      startDate.year && startDate.month && startDate.day
        ? `${startDate.year}-${startDate.month}-${startDate.day}`
        : 'Unknown';
    const end =
      endDate.year && endDate.month && endDate.day ? `${endDate.year}-${endDate.month}-${endDate.day}` : 'Unknown';

    const embed = new MessageEmbed()
      .setAuthor('AniList', 'https://anilist.co/img/icons/android-chrome-512x512.png')
      .setTitle(`${title} (${this.aniListFormats[format]})`)
      .setURL(siteUrl)
      .setColor(color)
      .setImage(coverImage)
      .setDescription(description)
      .addField('❯ Status', `• ${this.aniListStatuses[status]}\n• Start Date: ${start}\n• End Date: ${end}`, true);

    if (externalLinks.length > 0)
      embed.addField('❯ External Links', makeList(...externalLinks.map((l: any) => [link(l.site, l.url)])), true);

    const highestYear = Math.max(...rankings.map((r: any) => r.year));
    embed.addField(
      '❯ Rankings',
      makeKVList(
        ['Average Score', averageScore ?? 'Unknown', true, !meanScore],
        ['Mean Score', meanScore, true, !meanScore]
      ) +
        '\n' +
        makeList(
          ...rankings
            .filter((r: any) => r.allTime)
            .map((r: any) => [
              r.type === 'RATED' ? `#${r.rank} Highest Rated All-Time` : `#${r.rank} Most Popular All-Time`
            ]),
          ...rankings
            .filter((r: any) => r.year === highestYear)
            .map((r: any) => [
              r.type === 'RATED' ? `#${r.rank} Highest Rated ${highestYear}` : `#${r.rank} Most Popular ${highestYear}`
            ])
        ),
      true
    );
    interaction.reply({ embeds: [embed] });
  }
}
