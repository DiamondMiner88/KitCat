const config = require("../config.json");
const pfx = config.prefix;

module.exports = {
  command: "getperms",
  category: "moderation",
  help_name: `getperms`,
  help_description: `get the permissions of a user`,

  execute(client, message, args) {
    // const member = message.guild.member(message.mentions.members.first()).roles.highest.position;
    const member = message.guild.member(message.mentions.members.first()).roles.highest.permissions.toArray();
    message.channel.send(member);
  }
}
