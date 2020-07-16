const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");

module.exports = {
  command: "avatar",
  category: categories.utils,
  help_name: `Avatar`,
  help_description: `Get avatar of the user after the command. Can be a mention or a tag.\n\`${pfx}avatar {mention | user tag}\``,

  execute(client, message, args) {
    if (args[0] === undefined) {
      message.channel.send(`You need to mention someone or put their tag.`);
      return;
    }
    let target_user = message.mentions.users.first();
    if (!target_user) {
      let matching_users = client.users.cache.filter(user => user.username === args[0].split("#")[0]);
      target_user = matching_users.find(user => user.discriminator === args[0].split("#")[1]);
      if (!target_user) {
        message.channel.send('Member not found');
        return;
      }
    }
    message.channel.send({
      embed: {
        color: 0x0099ff,
        title: 'Avatar',
        fields: [{
          name: `${target_user.tag}'s Avatar`,
          value: target_user.avatarURL({
            format: "png"
          })
        }],
        image: {
          url: target_user.avatarURL({
            format: "png"
          })
        },
        timestamp: new Date(),
        footer: {
          text: `${message.author.tag} Executed: \`${message.content}\``,
          icon_url: message.author.avatarURL
        }
      }
    });
  }
}
