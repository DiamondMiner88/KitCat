const Discord = require('discord.js');

module.exports = {
  command: 'submission',
  category: require('./_CATEGORIES.js').utils,
  help_name: `Reddit submission`,
  help_description: `Gives a indepth embed of the linked Reddit post.`,
  usage: `subreddit {post link}`,
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
