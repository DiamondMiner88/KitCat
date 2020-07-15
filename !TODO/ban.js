const config = require("../config.json");
const pfx = config.prefix;

module.exports = {
  command: "ban",
  category: "moderation",
  help_name: `:no_entry_sign: Ban`,
  help_description: `Used to ban members.\n\`${pfx}ban {member} {optional: reason}\``,

  execute(client, message, args) {
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
}
