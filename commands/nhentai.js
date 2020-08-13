const { API } = require('nhentai-api');
const api = new API();
const { MessageEmbed } = require('discord.js');

const nhentai_book_url = 'https://nhentai.net/g/';

function tagsToString(tags) {
  var tagStr = '';
  for (const index in tags) tagStr += tags[index].name + ' (' + tags[index].count + '), ';
  if (tagStr === '') return undefined;
  return tagStr.slice(0, -2);
}

function getData(bookID, callback) {
  api
    .getBook(Number(bookID))
    .then((book) => {
      callback(undefined, {
        url: nhentai_book_url + book.id,
        id: book.id,
        titles: book.title,
        parodies: book.tags.filter((tag) => tag.type.type === 'parody'),
        characters: book.tags.filter((tag) => tag.type.type === 'character'),
        tags: book.tags.filter((tag) => tag.type.type === 'tag'),
        artists: book.tags.filter((tag) => tag.type.type === 'artist'),
        groups: book.tags.filter((tag) => tag.type.type === 'group'),
        lang: book.tags.filter((tag) => tag.type.type === 'language'),
        thumbnailURL: ''
      });
    })
    .catch((error) => callback(error.message, undefined));
}

function constructEmbed(data) {
  const { url, id, titles, parodies, characters, tags, artists, groups, lang, thumbnailURL } = data;
  var embed = new MessageEmbed()
    .setColor(0xffffff)
    .setURL(url)
    .setTitle('Overview')
    .setDescription(titles.pretty);
  if (parodies && tagsToString(parodies)) embed.addField('Parodies', tagsToString(parodies));
  if (characters && tagsToString(characters))
    embed.addField('Characters', tagsToString(characters));
  if (tags && tagsToString(tags)) embed.addField('Tags', tagsToString(tags));
  if (artists && tagsToString(artists)) embed.addField('Artists', tagsToString(artists));
  if (groups && tagsToString(groups)) embed.addField('Groups', tagsToString(groups));
  if (lang && tagsToString(lang)) embed.addField('Languages', tagsToString(lang));
  return embed;
}

module.exports = {
  command: 'nhentai',
  category: require('./_CATEGORIES.js').utils,
  help_name: 'nHentai',
  help_description: `Gives an overview of the nHentai code.`,
  usage: 'nhentai {number} ` or `{number}',
  guildOnly: false,
  unlisted: false,
  nsfw: true,

  execute(client, message, args) {
    if (message.channel.type !== 'dm' && !message.channel.nsfw)
      return message.channel.send('This command is only allowed in NSFW channels!');
    if (!args[0]) return message.channel.send('You did not provide a number!');
    if (!args[0].match(/\d{1,6}/g)) return message.channel.send('That is not a valid number!');
    getData(args[0], (error, data) => {
      if (error) {
        if (error === 'Request failed with status code 404')
          message.channel.send('This book does not exist!');
        else message.channel.send('Error: ' + error);
      } else message.channel.send(constructEmbed(data));
    });
  },
  multiMatch(message) {
    const matches = message.content.match(/\{\d{1,6}\}/g);
    for (let number of matches) {
      number = number.substring(1, number.length - 1);
      this.execute(undefined, message, [number]);
    }
  },
  constructEmbed,
  getData
};
