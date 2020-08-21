const Discord = require('discord.js');

module.exports = {
  command: 'avatar',
  category: require('./_CATEGORIES.js').utils,
  help_name: `Avatar`,
  help_description: `Get avatar of the user after the command. Can be a mention or a tag.`,
  usage: `avatar {mention | user tag}`,
  guildOnly: false,
  unlisted: false,

  /**
   * Sends the avatar of the target user
   * @param {Discord.TextChannel} message
   * @param {Array.<String>} args
   */
  execute(message, args) {
    if (!args[0]) {
      message.channel.send(`You need to mention someone or put their tag.`);
      return;
    }
    let target_user = message.mentions.users.first();
    if (!target_user) {
      let matching_users = message.client.users.cache.filter(
        (user) => user.username === args[0].split('#')[0]
      );
      target_user = matching_users.find((user) => user.discriminator === args[0].split('#')[1]);
      if (!target_user) {
        message.channel.send('Member not found');
        return;
      }
    }
    const logMsg = new Discord.MessageEmbed()
      .setTitle(`Avatar`)
      .setColor(0x0099ff)
      .addField(
        `${target_user.tag}'s Avatar`,
        target_user.avatarURL({
          format: 'png'
        })
      )
      .setImage(
        target_user.avatarURL({
          format: 'png'
        })
      );
    message.channel.send(logMsg);
  }
};
