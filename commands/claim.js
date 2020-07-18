const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");

module.exports = {
  command: "claim",
  category: categories.oofcoin,
  help_name: `Daily coins claim`,
  help_description: `Claim your daily coins! Available once every 24 hours.\n\`${pfx}claim\``,

  execute(client, message, args) {
    
  }
}
