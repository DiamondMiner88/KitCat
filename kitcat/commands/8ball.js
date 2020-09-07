const Discord = require('discord.js');
const eightball_config = [
  'It is certain.',
  'It is decidedly so. ',
  'Without a doubt. ',
  'Yes - definitely.',
  'You may rely on it.',
  'As I see it, yes.',
  'Most likely.',
  'Outlook good.',
  'Yes.',
  'Signs point to yes.',
  'Reply hazy, try again.',
  'Ask again later.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Concentrate and ask again.',
  "Don't count on it.",
  'My reply is no.',
  'My sources say no.',
  'Outlook not so good.',
  'Very doubtful.'
];

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
   * @param {Discord.Message} message
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
