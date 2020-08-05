const pfx = require('../config/config.json').prefix;
const Discord = require('discord.js');

module.exports = {
  command: 'kick',
  category: require('./_CATEGORIES.js').moderation,
  help_name: `:leg: Kick`,
  help_description: `Used to kick members.`,
  usage: `kick {mention | username#discriminator} {optional: reason}`,
  guildOnly: true,
  unlisted: false,

  execute(client, message, args) {
    if (!message.member.hasPermission('KICK_MEMBERS'))
      return message.author.send('You do not have the permission to kick members.');
    if (!args[0]) return message.channel.send('You did not mention a user to kick!');

    let target_user = message.mentions.users.first();
    if (!target_user) {
      let matching_users = client.users.cache.filter(
        (user) => user.username === args[0].split('#')[0]
      );
      target_user = matching_users.find((user) => user.discriminator === args[0].split('#')[1]);
      if (!target_user) {
        message.channel.send('Member to kick not found.');
        return;
      }
    }

    args.shift();

    const reason = args.length > 0 ? args.join(' ') : 'None';
    if (!message.guild.member(target_user).kickable) {
      message.channel.send('I am unable to kick the user because of missing permissions.');
      return;
    }

    const logMsg = new Discord.MessageEmbed()
      .setTitle(`*${target_user.username} got yeeted out the window*`)
      .setColor(0x0099ff)
      .addField('User kicked', `<@${target_user.id}>`)
      .addField('Kicked By', `<@${message.author.id}>`)
      .addField('Time', message.createdAt)
      .addField('Reason', reason);

    const uGotKicked = new Discord.MessageEmbed()
      .setTitle(`You got yeeted from \`${message.guild.name}\``)
      .setColor(0x0099ff)
      .addField('Kicked By', `<@${message.author.id}>`)
      .addField('Time', message.createdAt)
      .addField('Reason', reason);

    message.channel.send(logMsg).catch((err) => {});
    target_user.send(uGotKicked).catch((err) => {});

    message.guild
      .member(target_user)
      .kick({
        reason: reason
      })
      .catch((err) => message.channel.send(`Error kicking user: ${err.message}`));
  }
};
