module.exports = {
  command: 'purgechannel',
  category: require('./_CATEGORIES.js').moderation,
  help_name: `:wastebasket: Purge Channel`,
  help_description: `Used to delete to wipe all messages in a channel. ***This command deletes and makes a new channel in the exact same spot***`,
  usage: `purgechannel`,
  guildOnly: true,
  unlisted: false,

  execute(message) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      message.channel.send('You do not have the permission to manage messages.');
      return;
    }
    message.channel.send('This command is not implemented yet!');
  }
};
