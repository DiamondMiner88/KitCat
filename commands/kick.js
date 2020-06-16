const config = require("../config.json");
const pfx = config.prefix;
const Discord = require('discord.js')

module.exports = {
  command: "purge",
  category: "moderation",
  help_name: `:leg: Kick`,
  help_description: `Used to kick members.\n\`${pfx}kick {member} {optional: reason}\``,

  execute(client, message, args) {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      message.channel.send("You do not have the permission to kick members.");
      return;
    }
    let kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!kickUser) message.channel.send("Member not found.");
    let kickReason = args.join(" ").slice(22);
    if (kickUser.id.toString() === config.bot_id) {
      message.channel.send("I'm not going to kick myself.");
    }
    if (kickUser.id === message.author.id) {
      message.channel.send("Why are you trying to kick your self?");
      return;
    }
    if (kickReason === "") {
      kickReason = "None provided";
    }
    /*
    const authorPosition = message.guild.member(message.author).roles.highest.position;
    const kickUserPosition = message.guild.member(kickUser).roles.highest.position;
    if (authorPosition < kickUserPosition) {
      message.channel.send("You can't kick someone with a higher position than you.");
      return;
    }
    if(authorPosition === kickUserPosition) {
      message.channel.send("You can't kick someone the same position as you.");
      return;
    }
    const botPosition = message.guild.member(message.guild.me).roles.highest.position;
    if(botPosition < kickUserPosition) {
      message.channel.send("I can't kick them because they are superior to me.");
      return;
    }
    if(botPosition === kickUserPosition) {
      message.channel.send("I can't kick someone the same position as me.")
    }
    */
    let kickEmbed = new Discord.MessageEmbed()
      .setTitle("~ Kick ~")
      .setDescription(`<@${kickUser.id}> got kicked by <@${message.author.id}>`)
      .setColor("0x0099ff")
      .addFields({
        name: "Kicked User",
        value: `<@${kickUser.id}>`,
        inline: true
      }, {
        name: "Kicked By",
        value: `<@${message.author.id}>`,
        inline: true
      }, {
        name: "Kicked In",
        value: `<#${message.channel.id}>`,
        inline: true
      }, {
        name: "Time",
        value: message.createdAt,
        inline: true
      }, {
        name: "Reason",
        value: kickReason
      }, );

    let kickChannel = null;
    for (let i = 0; i < config.log_channels.length; i++) {
      kickChannel = message.guild.channels.cache.find(guild => guild.name === config.log_channels[i]);
      if (kickChannel) break
    }
    // let error = false;
    message.guild.member(kickUser).kick(kickReason) // .catch(error=true)
    // if (error) return message.channel.send("I can't kick that user, they are superior to me.");


    kickUser.send(new Discord.MessageEmbed()
      .setTitle("You got kicked!")
      .setColor("0x0099ff")
      .addFields({
        name: "Kicked By",
        value: `<@${message.author.id}>`,
        inline: true
      }, {
        name: "Kicked In",
        value: `<#${message.channel.id}>`,
        inline: true
      }, {
        name: "Time",
        value: message.createdAt,
        inline: true
      }, {
        name: "Reason",
        value: kickReason
      }, ));

    message.author.send(new Discord.MessageEmbed()
      .setTitle("You kicked someone!")
      .setColor("0x0099ff")
      .addFields({
        name: "Kicked User",
        value: `<@${kickUser.id}>`,
        inline: true
      }, {
        name: "Kicked In",
        value: `<#${message.channel.id}>`,
        inline: true
      }, {
        name: "Time",
        value: message.createdAt,
        inline: true
      }, {
        name: "Reason",
        value: kickReason
      }, ));

    if (!kickChannel) {
      kickEmbed.setFooter("Could not find any channel for bot logs, so emebd got sent here instead.");
      message.channel.send(kickEmbed);
      return;
    }

    kickChannel.send(kickEmbed);
  }
}
