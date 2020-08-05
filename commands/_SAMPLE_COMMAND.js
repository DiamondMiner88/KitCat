module.exports = {
  command: 'COMMANDNAME',
  category: require('./_CATEGORIES.js').utils,
  help_name: `help name`,
  help_description: `help description`,
  usage: `command_trigger {args}`,
  guildOnly: false,
  unlisted: false,

  execute(client, message, args) {}
};
