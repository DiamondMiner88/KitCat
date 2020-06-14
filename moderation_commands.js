const config = require("./config.json");
const pfx = config.prefix;
const blackListImageHash = require("./image-hash-blacklist.json")
const {
  imageHash
} = require('image-hash');

const Discord = require('discord.js')

async function moderation_commands(message, command, args, client) {
  if (command === "purge") {
    purgeamnt = config.default_purge_amnt;
    if (!isNaN(args[0])) purgeamnt = Number(args[0]);
    if (purgeamnt > 100) {
      message.channel.send(`The purging limit is 100`);
    }
    else {
      let tmpPurgeMsg;
      message.channel.bulkDelete(purgeamnt)
        .then((messages) => {
          tmpPurgeMsg = `Purged ${messages.size} messages`;
          message.channel.send(tmpPurgeMsg)
            .then(msg => msg.delete({
              timeout: 10000
            }));
        })
        .catch(console.error);
    }
  }
  else if (command === "ban") {
    if (!message.member.hasPermission("BAN_MEMBERS")) {
      message.channel.send(`You do not the permission to ban members.`);
      return;
    }
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
    if (message.member.hasPermission("BAN_MEMBERS")) {
      let target_member = message.guild.members.cache.find(member => member.id === target_user.id);
      channel = message.guild.channels.cache.find(channel => channel.name === 'bot-log');

      args.shift();
      let banLength;
      if (args.length === 0) {
        target_member.ban();
      }
      else if (isNaN(args[0])) {
        message.channel.send(`\`${args[1]}\` is not a number. Use 0 for a permenant ban.`);
        return;
      }
      banLength = parseInt(args[0]);
      args.shift()
      if (args.length === 0) {
        target_member.ban({
          days: banLength
        });
      }
      else {
        target_member.ban({
          days: banLength,
          reason: args.join(" ")
        });
      }
      if (channel !== undefined) channel.send(`\`${message.author.tag}\` has banned \`${target_member.tag}\`.`);
      else console.log(`bot-log channel is missing`);
    }
    else {
      message.channel.send(`You do not the permission to ban members.`)
    }
  }
  else if (command === "sban") {
    if (!message.member.hasPermission("BAN_MEMBERS")) {
      message.channel.send(`You do not the permission to ban members.`);
      return;
    }
    if (args[0] === undefined) {
      message.author.send(`You need to mention someone or put their tag.`);
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
    if (message.member.hasPermission("BAN_MEMBERS")) {
      let target_member = message.guild.members.cache.find(member => member.id === target_user.id);
      channel = message.guild.channels.cache.find(channel => channel.name === 'bot-log');

      args.shift();
      let banLength;
      if (args.length === 0) {
        target_member.ban();
      }
      else if (isNaN(args[0])) {
        message.author.send(`\`${args[1]}\` is not a number. Use 0 for a permenant ban.`);
        return;
      }
      banLength = parseInt(args[0]);
      args.shift()
      if (args.length === 0) {
        target_member.ban({
          days: banLength
        });
      }
      else {
        target_member.ban({
          days: banLength,
          reason: args.join(" ")
        });
      }
      if (channel !== undefined) message.author.send(`You have banned \`${target_member.tag}\`.`);
      else console.log(`bot-log channel is missing`);
    }
    else {
      message.author.send(`You do not the permission to ban members.`);
    }
  }
  else if (command === "skick") {

  }
  else if (command === "kick") {
    if (!message.member.hasPermission("KICK_MEMBERS")){
      message.channel.send("You do not have the permission to ban members.");
    }

    let kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!kickUser) message.channel.send("Member not found.");
    let kickReason = args.join(" ").slice(22);

    if (kickUser.id.toString() === config.bot_id) {
      message.channel.send("I'm not going to kick myself.");
    }

    if (kickReason === "") {
      kickReason = "None provided";
    }

    let kickEmbed = new Discord.MessageEmbed()
    .setTitle("~ Kick ~")
    .setDescription(`<@${kickUser.id}> got kicked by <@${message.author.id}>`)
    .setColor("0x0099ff")
    .addFields(
      { name: "Kicked User", value: `<@${kickUser.id}>`, inline: true },
      { name: "Kicked By", value: `<@${message.author.id}>`, inline: true },
      { name: "Kicked In", value: `<#${message.channel.id}>`, inline:true },
      { name: "Time", value: message.createdAt, inline: true },
      { name: "Reason", value: kickReason },
    );
    
    let kickChannel = null;
    for (let i = 0; i < config.log_channels.length; i++) {
      kickChannel = message.guild.channels.cache.find(guild => guild.name === config.log_channels[i]);
      if (kickChannel) break
    }
    // let error = false;
    message.guild.member(kickUser).kick(kickReason)// .catch(error=true)
    // if (error) return message.channel.send("I can't kick that user, they are superior to me.");


    kickUser.send(new Discord.MessageEmbed()
    .setTitle("You got kicked!")
    .setColor("0x0099ff")
    .addFields(
      { name: "Kicked By", value: `<@${message.author.id}>`, inline: true },
      { name: "Kicked In", value: `<#${message.channel.id}>`, inline:true },
      { name: "Time", value: message.createdAt, inline: true },
      { name: "Reason", value: kickReason },
    ));

    message.author.send(new Discord.MessageEmbed()
    .setTitle("You kicked someone!")
    .setColor("0x0099ff")
    .addFields(
      { name: "Kicked User", value: `<@${kickUser.id}>`, inline: true },
      { name: "Kicked In", value: `<#${message.channel.id}>`, inline:true },
      { name: "Time", value: message.createdAt, inline: true },
      { name: "Reason", value: kickReason },
    ));
    
    if (!kickChannel) {
      kickEmbed.setFooter("Could not find any channel for bot logs, so emebd got sent here instead.");
      message.channel.send(kickEmbed);
      return;
    }

    kickChannel.send(kickEmbed);
  }
  /*
  else if (command === "getperms") {
    const member = message.guild.member(message.mentions.members.first()).roles.highest.position;
    message.channel.send(member);
  }
  */
}

async function testBlacklistImage(message) {
  let url = undefined;
  if (message.attachments.size > 0) {
    url = message.attachments.first().url;
  }
  regex = /http?s:\/\/cdn\.discordapp\.com\/attachments\/.+?(?=\/)\/.+?(?=\/)\/.+/g;
  if (message.content.match(regex)) {
    url = message.content;
  }
  if (url !== undefined) {
    if (url.toLowerCase().indexOf("jpg", url.length - 3) !== -1) {
      imageHash(url, 16, true, (error, hash) => {
        if (error) throw error;
        console.log(hash + " " + url);
        if (blackListImageHash.includes(hash)) {
          message.delete();
        }
      });
    }
    if (url.toLowerCase().indexOf("png", url.length - 3) !== -1) {
      imageHash(url, 16, true, (error, hash) => {
        if (error) throw error;
        console.log(hash + " " + url);
        if (blackListImageHash.includes(hash)) {
          message.delete();
        }
      });
    }
  }
}

module.exports = {
  moderation_commands,
  testBlacklistImage
};
