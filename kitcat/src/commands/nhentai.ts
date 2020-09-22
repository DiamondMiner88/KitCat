import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './_Command';
import { API as NHAPI, Tag, BookTitle } from 'nhentai-api';
const api = new NHAPI();

export class NHentai extends Command {
  constructor() {
    super();
    this.executor = 'nhentai';
    this.category = 'util';
    this.display_name = 'NHentai';
    this.description = `Details about a certain doujinshi.`;
    this.usage = '{number}';
    this.guildOnly = false;
    this.unlisted = false;
    this.nsfw = true;
  }

  run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    if (args.length === 0) return message.channel.send(`You didn't provide a number to research!`);
    args.forEach(str => {
      if (!str.match(/\d{1,6}/g)) return message.channel.send(`\`${str}\` is not a valid number`);
      else getByID(message, Number(str));
    });
  }
}

function getByID(message: Discord.Message, doujin: number) {
  getData(doujin)
    .then(data => message.channel.send(constructEmbed(data)))
    .catch(error => {
      if (error === 'Request failed with status code 404')
        message.channel.send(`\`${doujin}\` is not a valid doujinshi!`);
      else message.channel.send('Error: ' + error);
    });
}

function tagsToString(tags: Tag[]) {
  var tagStr = '';
  for (const index in tags) tagStr += tags[index].name + ' (' + tags[index].count + '), ';
  if (tagStr === '') return undefined;
  return tagStr.slice(0, -2);
}

type TBookData = {
  url: string;
  id: number;
  titles: BookTitle;
  parodies: Tag[];
  characters: Tag[];
  tags: Tag[];
  artists: Tag[];
  groups: Tag[];
  lang: Tag[];
  coverURL: string;
};

function getData(bookID: number): Promise<TBookData> {
  return new Promise((resolve, reject) => {
    api
      .getBook(bookID)
      .then(book => {
        resolve({
          url: 'https://nhentai.net/g/' + book.id,
          id: book.id,
          titles: book.title,
          parodies: book.tags.filter(tag => tag.type.type === 'parody'),
          characters: book.tags.filter(tag => tag.type.type === 'character'),
          tags: book.tags.filter(tag => tag.type.type === 'tag'),
          artists: book.tags.filter(tag => tag.type.type === 'artist'),
          groups: book.tags.filter(tag => tag.type.type === 'group'),
          lang: book.tags.filter(tag => tag.type.type === 'language'),
          coverURL: `https://t.nhentai.net/galleries/${book.media}/cover.${book.cover.type.extension}`
        });
      })
      .catch(error => reject(error.message));
  });
}

function constructEmbed(data: TBookData) {
  const { url, id, titles, parodies, characters, tags, artists, groups, lang, coverURL } = data;
  var embed = new Discord.MessageEmbed()
    .setColor(0xf9f5ea)
    .setURL(url)
    .setTitle(titles.pretty)
    .setImage(coverURL);

  if (parodies && tagsToString(parodies)) embed.addField('Parodies', tagsToString(parodies));
  if (characters && tagsToString(characters))
    embed.addField('Characters', tagsToString(characters));
  if (tags && tagsToString(tags)) embed.addField('Tags', tagsToString(tags));
  if (artists && tagsToString(artists)) embed.addField('Artists', tagsToString(artists));
  if (groups && tagsToString(groups)) embed.addField('Groups', tagsToString(groups));
  if (lang && tagsToString(lang)) embed.addField('Languages', tagsToString(lang));
  return embed;
}
