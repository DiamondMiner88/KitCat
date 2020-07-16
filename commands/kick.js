const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");
const Discord = require('discord.js');

module.exports = {
  command: "kick",
  category: categories.kick,
  help_name: `:leg: Kick`,
  help_description: `Used to kick members.\n\`${pfx}kick {member} {optional: reason}\``,

  execute(client, message, args) {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      message.channel.send("You do not have the permission to kick members.");
      return;
    }

    let target_user = message.mentions.users.first();
    if (!target_user) {
      let matching_users = client.users.cache.filter(user => user.username === args[0].split("#")[0]);
      target_user = matching_users.find(user => user.discriminator === args[0].split("#")[1]);
      if (!target_user) {
        message.channel.send('Member to kick not found.');
        return;
      }
    }

    args.shift();

    const reason = args.length > 0 ? args.join(" ") : "None";
    if (!message.guild.member(target_user).kickable) {
      message.channel.send("I am unable to kick the user because of missing permissions.");
      return;
    }

    const logMsg = new Discord.MessageEmbed()
      .setTitle(`*${target_user.username} got yeeted out the window*`)
      .setColor(0x0099ff)
      .addField("User kicked", `<@${target_user.id}>`)
      .addField("Kicked By", `<@${message.author.id}>`)
      .addField("Time", message.createdAt)
      .addField("Reason", reason);

    const uGotKicked = new Discord.MessageEmbed()
      .setTitle(`You got kicked from \`${message.guild.name}\``)
      .setColor(0x0099ff)
      .addField("Kicked By", `<@${message.author.id}>`)
      .addField("Time", message.createdAt)
      .addField("Reason", reason);

    message.channel.send(logMsg);
    target_user.send(uGotKicked);

    message.guild.member(target_user).kick({
      reason: reason
    }).catch(err => message.channel.send(`Error kicking user: ${err.message}`));
  }
}
