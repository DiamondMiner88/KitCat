const Discord = require('discord.js');

module.exports = {
  command: 'purge',
  category: require('./_CATEGORIES.js').moderation,
  help_name: `:wastebasket: Purge`,
  help_description: `Used to delete messages in bulk.`,
  usage: `purge {amount: default = 5}`,
  guildOnly: true,
  unlisted: false,

  /**
   * Purges a specified amount of message from the channel
   * @param {Discord.TextChannel} message
   * @param {Array.<String>} args
   */
  execute(message, args) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      message.channel.send('You do not have the permission to manage messages.');
      return;
    }
    let purgeamnt = 5;
    if (!isNaN(args[0])) purgeamnt = Number(args[0]);
    if (purgeamnt > 100) {
      message.channel.send(`The purging limit is 100`);
    } else {
      message.channel
        .bulkDelete(purgeamnt)
        .then((messages) => {
          message.channel
            .send(`Purged ${messages.size} messages, deleting this in 3 seconds.`)
            .then((msg) => {
              msg
                .delete({
                  timeout: 2000
                })
                .catch((err) => {});
            });
        })
        .catch((err) => message.channel.send(err.message));
    }
  }
};
