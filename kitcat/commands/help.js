const Discord = require('discord.js');
const pfx = require('../config/config.json').prefix;
const categories = require('./_CATEGORIES.js');

module.exports = {
  command: 'help',
  category: categories.utils,
  help_name: `Help`,
  help_description: `What you're looking at right now.`,
  usage: `help`,
  guildOnly: false,
  unlisted: false,

  /**
   * Displays help embed
   * @param {Discord.TextChannel} message
   * @param {Array.<String>} args
   */
  execute(message, args) {
    if (args.length === 0) {
      var embed = new Discord.MessageEmbed().setColor(0x0099ff).setTitle('Categories:');
      for (const key in categories) {
        // Skip loop if the property is from prototype (I have no idea what this means this was from stackoverflow)
        if (!categories.hasOwnProperty(key)) continue;

        const category = categories[key];
        const desc =
          category.help_description && category.help_description !== ''
            ? category.help_description + '\n' + category.usage
            : category.usage;
        embed.addField(category.help_name, desc);
      }
      embed.addField(
        'Issues',
        `See an issue? Report it [here](${require('../package.json').bugs.url}).`
      );
      message.channel.send(embed);
    } else if (!categories[args[0]]) {
      message.channel.send('Invalid category!');
    } else {
      const commands = message.client.commands
        .filter((command) => command.category === categories[args[0]])
        .filter((command) => !command.unlisted);
      var embed = new Discord.MessageEmbed()
        .setColor(0x0099ff)
        .setTitle(categories[args[0]].help_name)
        .setDescription(categories[args[0]].help_description);
      commands.forEach((command) => {
        const desc = `${command.help_description}\n\`${pfx}${command.usage}\``;
        embed.addField(command.help_name, desc);
      });
      message.channel.send(embed);
    }
  }
};
