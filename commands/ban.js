const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");
const Discord = require('discord.js');

module.exports = {
  command: "ban",
  category: categories.ban,
  help_name: `:leg: Kick`,
  help_description: `Used to ban members.\n\`${pfx}kick {ban} {optional: reason}\``,

  execute(client, message, args) {
    if (!message.member.hasPermission("BAN_MEMBERS")) {
      message.channel.send("You do not have the permission to ban members.");
      return;
    }

    let target_user = message.mentions.users.first();
    if (!target_user) {
      let matching_users = client.users.cache.filter(user => user.username === args[0].split("#")[0]);
      target_user = matching_users.find(user => user.discriminator === args[0].split("#")[1]);
      if (!target_user) {
        message.channel.send('Member to ban not found.');
        return;
      }
    }

    args.shift();

    const reason = args.length > 0 ? args.join(" ") : "None";
    if (!message.guild.member(target_user).bannable) {
      message.channel.send("I am unable to ban the user because of missing permissions.");
      return;
    }

    const logMsg = new Discord.MessageEmbed()
      .setTitle(`*${target_user.username} got yeeted out the window*`)
      .setColor(0x0099ff)
      .addField("User banned", `<@${target_user.id}>`)
      .addField("Banned By", `<@${message.author.id}>`)
      .addField("Time", message.createdAt)
      .addField("Reason", reason);

    const uGotBanned = new Discord.MessageEmbed()
      .setTitle(`You got banned from \`${message.guild.name}\``)
      .setColor(0x0099ff)
      .addField("Banned By", `<@${message.author.id}>`)
      .addField("Time", message.createdAt)
      .addField("Reason", reason);

    message.channel.send(logMsg);
    target_user.send(uGotBanned);

    message.guild.member(target_user).ban({
      reason: reason
  }).catch(err => message.channel.send(`Error banning user: ${err.message}`));
  }
}
