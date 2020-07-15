const config = require("../config.json");
const pfx = config.prefix;
const eightball_config = require("../config/8ball.json");

module.exports = {
  command: "8ball",
  category: "fun",
  help_name: `:8ball: 8Ball`,
  help_description: `Ask it a question, and it will give you an answer.\n\`${pfx}8ball {question}\``,

  execute(client, message, args) {
    if (args !== undefined) {
      message.channel.send(`Question: ${args.join(" ")}\nAnswer: ${eightball_config.eight_ball_replies[Math.floor(Math.random()*eightball_config.eight_ball_replies.length)]}`);
    }
    else {
      message.channel.send(`You didn't ask a question`);
    }
  }
}
