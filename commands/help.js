const config = require("../config.json");
const pfx = config.prefix;
const Discord = require('discord.js');

module.exports = {
  command: "help",
  category: "utils",
  help_name: `Help`,
  help_description: `What you're looking at right now.\n\`${pfx}help\``,

  execute(client, message, args) {
    if (args.length === 0) {
      let embed = new Discord.MessageEmbed()
        .setColor(0x0099ff)
        .setTitle("Command sections:")
        .addField("Moderation Commands", `\`${pfx}help moderation\``)
        .addField(":smile: Fun", `\`${pfx}help fun\``)
        .addField(":tools: Utility Commands", `\`${pfx}help utils\``)
        .addField(":loud_sound: Audio Clips", `\`${pfx}help soundboard\``);
      message.channel.send(embed);
    }
    else if (args[0] === "moderation") {
      let commands = client.commands.filter(command => command.category === "moderation");
      let embed = new Discord.MessageEmbed()
        .setColor(0x0099ff)
        .setTitle("Moderation Commands")
      commands.forEach((command) => {
        embed.addField(command.help_name, command.help_description);
      });
      message.channel.send(embed);
    }
    else if (args[0] === "fun") {
      let commands = client.commands.filter(command => command.category === "fun");
      let embed = new Discord.MessageEmbed()
        .setColor(0x0099ff)
        .setTitle(":smile: Fun")
      commands.forEach((command) => {
        embed.addField(command.help_name, command.help_description);
      });
      message.channel.send(embed);
    }
    else if (args[0] === "utils") {
      let commands = client.commands.filter(command => command.category === "utils");
      let embed = new Discord.MessageEmbed()
        .setColor(0x0099ff)
        .setTitle(":tools: Utility Commands")
      commands.forEach((command) => {
        embed.addField(command.help_name, command.help_description);
      });
      message.channel.send(embed);
    }
  }
}
