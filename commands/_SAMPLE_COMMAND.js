
const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");

module.exports = {
  command: "COMMANDNAME",
  category: categories.utils,
  help_name: `help name`,
  help_description: `help description`,

  execute(client, message, args) {
  }
}
