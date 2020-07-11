const config = require("../config.json");
const pfx = config.prefix;

module.exports = {
  command: "SAMPLE_COMMAND",
  category: "CATEGORY-moderation/fun/utils/other",
  help_name: `NAME TO BE DISPLAYED ON HELP COMMAND`,
  help_description: `DESCRIPTON OF COMMAND FOR HELP COMMAND`,

  execute(client, message, args) {
    // This gets called when the command is equal the file name without ".js" and #command on line 5 here
  }
}
