const config = require("../config.json");
const pfx = config.prefix;

module.exports = {
  command: "COMMAND_EXECUTOR",
  category: "CATEGORY-moderation/fun/utils/other",
  help_name: `NAME TO BE DISPLAYED ON HELP COMMAND`,
  help_description: `DESCRIPTON OF COMMAND FOR HELP COMMAND`,

  execute(client, message, args) {
    // This gets called when the command is equal to #command on line 5
  }
}
