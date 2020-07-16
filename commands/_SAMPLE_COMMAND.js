const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");

module.exports = {
  command: "SAMPLE_COMMAND",
  category: categories.utils,
  help_name: `NAME TO BE DISPLAYED ON HELP COMMAND`,
  help_description: `DESCRIPTON OF COMMAND FOR HELP COMMAND`,

  execute(client, message, args) {
    // This gets called when the command is equal the file name without ".js" and #command on line 5 here
  }
}
