const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");

module.exports = {
  command: "say",
  category: categories.fun,
  help_name: `say`,
  help_description: `Make the bot say whatever you want!\n\`${pfx}say {message}\``,
  guildOnly: false,
  unlisted: false,

  execute(client, message, args) {
    if (args.length == 0) message.author.send("You didn't provide a message to say!");
    else message.channel.send(args.join(" "));
    message.delete();
  }
}
