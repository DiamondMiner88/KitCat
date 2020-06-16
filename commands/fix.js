const config = require("../config.json");
const pfx = config.prefix;

module.exports = {
  command: "fix",
  category: "utils",
  help_name: `Several fixing utils`,
  help_description: `Several commands that fix stuff\n\`${pfx}fix muted_role\``,

  execute(client, message, args) {
    if (args[0] === "muted_role") {
      //TODO: fix permissions on the muted role
    }
    else if (args[0] === undefined) message.channel.send("You did not give a thing to fix.");
    else message.channel.send(`\`${args[0]}\` is not a valid thing to fix.`);
  }
}
