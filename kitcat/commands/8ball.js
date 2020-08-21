const Discord = require('discord.js');
const eightball_config = require('../config/8ball.json');

module.exports = {
  command: '8ball',
  category: require('./_CATEGORIES.js').fun,
  help_name: `:8ball: 8Ball`,
  help_description: `Ask it a question, and it will give you an answer.`,
  usage: `8ball {Your Question}`,
  guildOnly: false,
  unlisted: false,

  /**
   * Gets random string from /config/8ball.json and sends it
   * @param {Discord.TextChannel} message
   * @param {Array.<String>} args
   */
  execute(message, args) {
    if (args.length > 0)
      message.channel.send(
        `Question: ${args.join(' ')}\nAnswer: ${
          eightball_config.eight_ball_replies[
            Math.floor(Math.random() * eightball_config.eight_ball_replies.length)
          ]
        }`
      );
    else message.channel.send(`You didn't ask a question`);
  }
};
