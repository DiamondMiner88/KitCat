module.exports = {
  command: 'meme',
  category: require('./_CATEGORIES.js').fun,
  help_name: `:joy: Memes`,
  help_description: `Get a meme from r/memes`,
  usage: `meme`,
  guildOnly: false,
  unlisted: false,

  execute(message) {
    require('../reddit.js').getTopPost(message, 'memes');
  }
};
