const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");
const Discord = require('discord.js');

module.exports = {
  command: "avatar",
  category: categories.utils,
  help_name: `Avatar`,
  help_description: `Get avatar of the user after the command. Can be a mention or a tag.\n\`${pfx}avatar {mention | user tag}\``,
  guildOnly: false,
  unlisted: false,

  /**
   * execute - Gets the avatar of the user that's in args[0]
   *
   * @param  {String} args [{Mention | User tag}]
   * @returns {void}
   */
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
    const logMsg = new Discord.MessageEmbed()
      .setTitle(`Avatar`)
      .setColor(0x0099ff)
      .addField(`${target_user.tag}'s Avatar`, target_user.avatarURL({
        format: "png"
      }))
      .setImage(target_user.avatarURL({
        format: "png"
      }));
    message.channel.send(logMsg);
  }
}
