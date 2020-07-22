const config = require("../config/config.json");
const pfx = config.prefix;
const {
  DiscordAPIError
} = require("discord.js");

module.exports = {
  command: "purgechannel",
  category: require("./_CATEGORIES.js").moderation,
  help_name: `:wastebasket: Purge Channel`,
  help_description: `Used to delete to wipe all messages in a channel\n\`${pfx}purgechannel\`\n***This command deletes and makes a new channel in the exact same spot***`,
  guildOnly: true,
  unlisted: false,

  execute(client, message, args) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      message.channel.send("You do not have the permission to manage messages.");
      return;
    }
    message.channel.send("This command is not implemented yet!")
  }
}
