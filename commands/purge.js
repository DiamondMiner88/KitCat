const config = require("../config/config.json");
const pfx = config.prefix;
const {
  DiscordAPIError
} = require("discord.js");

module.exports = {
  command: "purge",
  category: require("./_CATEGORIES.js").moderation,
  help_name: `:wastebasket: Purge`,
  help_description: `Used to delete messages\n\`${pfx}purge {amount: default = ${config.default_purge_amnt}}\``,
  guildOnly: false,
  unlisted: false,

  execute(client, message, args) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      message.channel.send("You do not have the permission to manage messages.");
      return;
    }
    let purgeamnt = config.default_purge_amnt;
    if (!isNaN(args[0])) purgeamnt = Number(args[0]);
    if (purgeamnt > 100) {
      message.channel.send(`The purging limit is 100`);
    }
    else {
      message.channel.bulkDelete(purgeamnt)
        .then(messages => {
          message.channel.send(`Purged ${messages.size} messages, deleting this in 3 seconds.`)
            .then(msg => {
              msg.delete({
                timeout: 3000
              }).catch(err => {});
            });
        })
        .catch(err => message.channel.send(err.message));
    }
  }
}
