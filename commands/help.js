const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");
const Discord = require('discord.js');

module.exports = {
  command: "help",
  category: categories.utils,
  help_name: `Help`,
  help_description: `What you're looking at right now.\n\`${pfx}help\``,

  execute(client, message, args) {
    if (args.length === 0) {
      var embed = new Discord.MessageEmbed()
        .setColor(0x0099ff)
        .setTitle("Categories:");
      for (var key in categories) {
        // skip loop if the property is from prototype
        if (!categories.hasOwnProperty(key)) continue;
        var category = categories[key];
        var desc = category.help_description !== "" ? category.help_description + "\n" + category.usage : category.usage;
        embed.addField(category.help_name, desc);
      }
      message.channel.send(embed);
    }
    else if (!categories[args[0]]) {
      message.channel.send("Invalid category!");
    }
    else {
      const commands = client.commands.filter(command => command.category === categories[args[0]]);
      var embed = new Discord.MessageEmbed()
        .setColor(0x0099ff)
        .setTitle(categories[args[0]].help_name)
        .setDescription(categories[args[0]].help_description);
      commands.forEach(command => {
        embed.addField(command.help_name, command.help_description);
      });
      message.channel.send(embed);
    }
  }
}
