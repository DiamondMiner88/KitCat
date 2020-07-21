const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");

module.exports = {
  command: "claim",
  category: categories.oofcoin,
  help_name: `Claim your daily coins!`,
  help_description: `Claim your daily coins! Available once every 24 hours.\n\`${pfx}claim\``,
  guildOnly: false,
  unlisted: false,

  execute(client, message, args) {

  }
}
