const config = require("../config.json");
const pfx = config.prefix;

module.exports = {
  command: "say",
  category: "fun",
  help_name: `say`,
  help_description: `Make the bot say whatever you want!\n\`${pfx}say {message}\``,

  execute(client, message, args) {
    if (args.length == 0) message.author.send("You didn't provide a message to say!");
    else message.channel.send(args.join(" "));
    message.delete();
  }
}
