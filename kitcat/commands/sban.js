const Discord = require('discord.js');

module.exports = {
  command: 'sban',
  category: require('./_CATEGORIES.js').moderation,
  help_name: `:no_entry: Silent ban`,
  help_description: `Used to silently ban members.`,
  usage: `sban {mention | username#discriminator} {optional: reason}`,
  guildOnly: true,
  unlisted: false,

  /**
   * Silently ban someone
   * @param {Discord.TextChannel} message
   * @param {Array.<String>} args
   */
  execute(message, args) {
    message.delete();
    if (!message.member.hasPermission('BAN_MEMBERS'))
      return message.author.send('You do not have the permission to ban members.');
    if (!args[0]) return message.author.send('You did not mention a user to ban!');

    let target_user = message.mentions.users.first();
    if (!target_user) {
      let matching_users = message.client.users.cache.filter(
        (user) => user.username === args[0].split('#')[0]
      );
      target_user = matching_users.find((user) => user.discriminator === args[0].split('#')[1]);
      if (!target_user) {
        message.author.send('Member to ban not found.');
        return;
      }
    }

    args.shift();

    const reason = args.length > 0 ? args.join(' ') : 'None';
    if (!message.guild.member(target_user).bannable) {
      message.author.send('I am unable to ban the user because of missing permissions.');
      return;
    }

    const logMsg = new Discord.MessageEmbed()
      .setTitle(`*You yeeted ${target_user.username} out the window*`)
      .setColor(0x0099ff)
      .addField('User banned', `<@${target_user.id}>`)
      .addField('Time', message.createdAt)
      .addField('Reason', reason);

    const uGotBanned = new Discord.MessageEmbed()
      .setTitle(`You got banned from \`${message.guild.name}\``)
      .setColor(0x0099ff)
      .addField('Time', message.createdAt)
      .addField('Reason', reason);

    message.author.send(logMsg).catch((err) => {});
    target_user.send(uGotBanned).catch((err) => {});

    message.guild
      .member(target_user)
      .ban({
        reason: reason
      })
      .catch((err) => message.author.send(`Error banning user: ${err.message}`));
  }
};
