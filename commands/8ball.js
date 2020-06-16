const config = require("../config.json");
const pfx = config.prefix;

module.exports = {
  command: "8ball",
  category: "fun",
  help_name: `:8ball: 8Ball`,
  help_description: `Ask it a question, and it will give you an answer.\n\`${pfx}8ball {question}\``,

  execute(client, message, args) {
    if (args !== undefined) {
      message.channel.send(`Question: ${args.join(" ")}\nAnswer: ${config.eight_ball_replies[Math.floor(Math.random()*config.eight_ball_replies.length)]}`);
    }
    else {
      message.channel.send(`You didn't ask a question`);
    }
  }
}
