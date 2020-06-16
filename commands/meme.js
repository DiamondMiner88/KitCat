const config = require("../config.json");
const pfx = config.prefix;

module.exports = {
  command: "meme",
  category: "fun",
  help_name: `:joy: Memes`,
  help_description: `Get a meme from r/${config.memes_subreddit}\n\`${pfx}meme\``,

  execute(client, message, args) {
    require("../reddit.js").getTopPost(message, config.memes_subreddit);
  }
}
