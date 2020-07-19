const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");

module.exports = {
  command: "dev",
  category: categories.utils,
  unlisted: true,

  execute(client, message, args) {
    if (["295190422244950017", "407320720662855692", "678683775017943050"].includes(message.author.id)) {
      const command = args.shift();
      switch (command) {
        case "restart":
          if (process.platform === 'win32') return message.channel.send("I am running on Windows, and this command only works on UNIX systems.");
          message.channel.send("Restarting, this *may* take a minute if new packages were added...");
          var spawn = require('child_process').spawn;
          spawn('./run.sh &', [], {
            detached: true,
            stdio: 'ignore'
          }).unref()
          process.exit(0);
          break;
        case "exit":
          process.exit(0);
          break;
        default:
          message.channel.send("That is not a valid subcommand!");
          break;
      }
    }
    else message.channel.send("This command is only for my developers!")
  }
}
