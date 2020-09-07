const Discord = require('discord.js');

module.exports = {
  command: 'purgechannel',
  category: require('./_CATEGORIES.js').moderation,
  help_name: `:wastebasket: Purge Channel`,
  help_description: `Used to delete to wipe all messages in a channel. ***This command deletes and makes a new channel in the same***`,
  usage: `purgechannel`,
  guildOnly: true,
  unlisted: false,

  /**
   * Deletes the channel and creates a new one with the same properties
   * @param {Discord.Message} message
   */
  execute(message) {
    if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.channel.send('You do not have the permission to manage messages.');
    if (!message.channel.deletable)
      return message.channel.send("I don't have permission to delete this channel!");

    const position = message.channel.rawPosition;

    message.channel.clone().then((channel) => {
      message.channel.delete().then(() => {
        channel.setPosition(position);
      });
    });
  }
};
