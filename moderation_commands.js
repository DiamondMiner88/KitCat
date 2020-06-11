const config = require("./config.json");
const pfx = config.prefix;
const blackListImageHash = require("./image-hash-blacklist.json")
const {
  imageHash
} = require('image-hash');

function moderation_commands(message, command, args, client) {
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
    }
    else {
      message.channel.send(`You do not the permission to ban members.`)
    }
    // channel = message.guild.channels.cache.find(channel => channel.name === 'bot-log');
    // if (channel !== undefined) channel.send(`\`${message.author.tag}\` has left the server.`);
    // else console.log(`welcome channel is missing`);
  }
  if (command === "kick") {

  }
  if (command === "sban") {

  }
  if (command === "skick") {

  }
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
