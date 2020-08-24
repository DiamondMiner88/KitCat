const Discord = require('discord.js');

module.exports = {
  command: 'status',
  category: require('./_CATEGORIES.js').utils,
  help_name: `Bot Status`,
  help_description: `See the bot's status`,
  usage: `status`,
  guildOnly: false,
  unlisted: false,

  /**
   * Claim daily oofcoins
   * @param {Discord.TextChannel} message
   * @param {Array.<String>} args
   */
  execute(message) {
    message.channel.send('This command has not been implemented yet!');
  }
};
