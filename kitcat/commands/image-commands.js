const Discord = require('discord.js');
const pfx = process.env.BOT_PREFIX;

const ImageCmdHelp = [
  {
    name: 'Minecraft Achievement',
    description: `Make custom Minecraft achievement.\n\`${pfx}image minecraft {description}\``
  }
];

module.exports = {
  command: 'image',
  category: require('./_CATEGORIES.js').fun,
  help_name: `:camera: Photo Commands`,
  help_description: `Run photo commands to make custom photos.`,
  usage: `image help`,
  guildOnly: false,
  unlisted: false,

  /**
   * Idk what this is
   * @param {Discord.TextChannel} message
   * @param {Array.<String>} args
   */
  execute(message, args) {
    if (args.length === 0) {
      return message.channel.send(
        `Didn't provide any image type run \`${pfx}image help\` for image commands.`
      );
    }
    if (args[0] === 'help') {
      var embed = new Discord.MessageEmbed().setTitle('Image Commands').setColor('#0000FF');
      for (var number in ImageCmdHelp) {
        embed.addField(ImageCmdHelp[number].name, ImageCmdHelp[number].description, true);
      }
      return message.channel.send(embed);
    }
    switch (args[0].toLowerCase()) {
      case 'minecraft':
        require('./ImageCommands/minecraft').minecraft(message, args);
        break;
      case 'meme':
        require('./ImageCommands/meme').meme(message, args);
        break;
    }
  }
};
