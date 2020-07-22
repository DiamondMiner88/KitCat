const pfx = require("../config/config.json").prefix;

module.exports = {
  command: "subreddit",
  category: require("./_CATEGORIES.js").fun,
  help_name: `:globe_with_meridians: Subreddit`,
  help_description: `Get a top post from a subreddit! (NSFW subreddits allowed in NSFW channels)\n\`${pfx}subreddit {subreddit}\``,
  guildOnly: false,
  unlisted: false,

  execute(client, message, args) {
    if (args[0] === undefined) {
      message.channel.send(`Missing subreddit`);
      return;
    }
    require("../reddit.js").getTopPost(message, args[0]);
  }
}
