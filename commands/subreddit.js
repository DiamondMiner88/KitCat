const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");

module.exports = {
  command: "subreddit",
  category: categories.fun,
  help_name: `:globe_with_meridians: Subreddit`,
  help_description: `Get a top post from a subreddit! (NSFW subreddits allowed in NSFW channels)\n\`${pfx}subreddit {subreddit}\``,

  execute(client, message, args) {
    if (args[0] === undefined) {
      message.channel.send(`Missing subreddit`);
      return;
    }
    require("../reddit.js").getTopPost(message, args[0]);
  }
}
