const Discord = require('discord.js');

module.exports = {
  command: 'custom-img',
  category: require('./_CATEGORIES.js').fun,
  help_name: `:camera: Photo Commands`,
  help_description: `Image commands to make kool custom photos.`,
  usage: `custom-img help`,
  guildOnly: false,
  unlisted: false,

  /**
   * @param {Discord.Message} message
   * @param {Array.<String>} args
   */
  execute(message, args) {
    const pfx = message.client.guildSettingsCache.get(message.guild.id).prefix;
    if (args.length === 0)
      return message.channel.send(
        `You didn't provide any image command to run! Do \`${pfx}${this.command} help\` for a list!`
      );
    const subcommand = args.shift();
    switch (subcommand) {
      case 'help':
        return message.channel.send(
          new Discord.MessageEmbed()
            .setTitle('Image Commands')
            .setColor(0x0000ff)
            .addField(
              'Minecraft Achievement',
              `Make custom Minecraft achievement.\n\`${pfx}${this.command} minecraft {achievement}\``
            )
        );
      case 'mc':
        return message.channel.send(
          `https://minecraftskinstealer.com/achievement/3/Achievement%20Get%21/${encodeURIComponent(
            args.join(' ')
          )}`
        );
    }
  }
};
