const Discord = require('discord.js');

module.exports = {
  command: 'COMMANDNAME',
  category: require('./_CATEGORIES.js').utils,
  help_name: `help name`,
  help_description: `help description`,
  usage: `command_trigger {args}`,
  guildOnly: false,
  unlisted: false,

  /**
   * @param {Discord.TextChannel} message
   * @param {Array.<String>} args
   */
  execute(message, args) {}
};
