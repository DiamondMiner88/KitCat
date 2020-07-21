const pfx = require("../config/config.json").prefix;

module.exports = {
  command: "meme",
  category: require("./_CATEGORIES.js").fun,
  help_name: `:joy: Memes`,
  help_description: `Get a meme from r/memes\n\`${pfx}meme\``,
  guildOnly: false,
  unlisted: false,

  execute(client, message, args) {
    require("../reddit.js").getTopPost(message, "memes");
  }
}
