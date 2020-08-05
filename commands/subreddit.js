module.exports = {
  command: 'subreddit',
  category: require('./_CATEGORIES.js').fun,
  help_name: `:globe_with_meridians: Subreddit`,
  help_description: `Get a top post from a subreddit! (NSFW subreddits allowed in NSFW channels)`,
  usage: `subreddit {Subreddit name}`,
  guildOnly: false,
  unlisted: false,

  execute(client, message, args) {
    if (!args[0]) return message.channel.send(`Missing subreddit`);
    require('../reddit.js').getTopPost(message, args[0]);
  }
};
