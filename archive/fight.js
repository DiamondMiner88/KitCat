const config = require("../config.json");
const prefix = config.prefix;
const categories = require("./_CATEGORIES.js");

module.exports = {
  command: "fight",
  category: null,
  help_name: `NAME TO BE DISPLAYED ON HELP COMMAND`,
  help_description: `DESCRIPTON OF COMMAND FOR HELP COMMAND`,

  execute(client, message, args) {
    //checks if the username to fight is in the message
    let author1 = message.author.username;
    let user = message.mentions.users.first();
    if(!user) return message.reply("you did not specify who you would like to fight!");

    //checks if the users is trying to fight themselves
    if(user.id == message.author.id) return message.reply('you cannot fight yourself!');

    //checks if the user is trying to fight the bot
    if(user.bot ==  true)
        return message.reply('you cannot fight a bot!');

    //saves the two user ids to variables
    var fighter1 = message.author.id;
    var fighter2 = user.id;

    //announces challenge and awaits response
    var challenged = user.toString();
    message.channel.send(`${challenged}, ${author1} has challenged you to a duel. Do you accept the challenge, yes or no?`)
        .then(() => {
            message.channel.awaitMessages((response, user) => response.content == 'yes' && response.author.id == fighter2 || response.content == 'no' && response.author.id == fighter2, {
                max: 1,
                time: 60000,
                errors: ['time'],
            })
            .then((collected) => {
                if (collected.first().content == 'yes') {
                    message.channel.send(`${challenged} has accepted the challenge!`);
                }
                else if(collected.first().content == 'no') {
                    message.channel.send(`nope`);
                }
            })
            .catch(() => {
                message.channel.send(`No response. Fight has been cancelled.`);
            });
        });
  }
}
