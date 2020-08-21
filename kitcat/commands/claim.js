const Discord = require('discord.js');

module.exports = {
  command: 'claim',
  category: require('./_CATEGORIES.js').oofcoin,
  help_name: `Claim your daily coins!`,
  help_description: `Claim your daily coins! Available once every 24 hours.`,
  usage: `claim`,
  guildOnly: false,
  unlisted: true,

  /**
   * Claim daily oofcoins
   * @param {Discord.TextChannel} message
   * @param {Array.<String>} args
   */
  execute(message) {
    require('../db.js').checkForProfile(message.author);
    message.channel.send('This command has not been implemented yet!');
  }
};
