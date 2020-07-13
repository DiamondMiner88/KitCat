const config = require("../config.json");
const pfx = config.prefix;
const Discord = require('discord.js');

module.exports = {
  command: "2048",
  category: "fun",
  help_name: `The game 2048`,
  help_description: `Play 2048 in Discord\n\`${pfx}2048 help\``,

  async execute(client, message, args) {
    if (args[0] === "help") {
      var embed = new Discord.MessageEmbed()
        .setColor(0x0099ff)
        .setTitle("2048 commands:")
        .addField("help", `What you're looking at right now.\n\`${pfx+command} help\``)
        .addField("new", `Start a new game. *This cancels any current game*\n\`${pfx+command} new {size: default: 5}\``)
        .addField("stop", `End the current game\n\`${pfx+command} stop\``);
      message.channel.send(embed);
    }
  }
}
