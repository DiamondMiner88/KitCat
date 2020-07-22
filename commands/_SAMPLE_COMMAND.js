const config = require("../config/config.json");
const pfx = config.prefix;

module.exports = {
  command: "COMMANDNAME",
  category: require("./_CATEGORIES.js").utils,
  help_name: `help name`,
  help_description: `help description`,
  guildOnly: false,
  unlisted: false,

  execute(client, message, args) {

  }
}
