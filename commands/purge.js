const config = require("../config.json");
const {
  DiscordAPIError
} = require("discord.js");
const pfx = config.prefix;

module.exports = {
  command: "purge",
  category: "moderation",
  help_name: `:wastebasket: Purge`,
  help_description: `Used to delete messages\n\`${pfx}purge {amount: default = ${config.default_purge_amnt}}\``,

  execute(client, message, args) {
    let purgeamnt = config.default_purge_amnt;
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
        }).catch((error) => {
          // console.log(error);
          if (error instanceof DiscordAPIError) {
            message.channel.send("You can only bulk delete messages that are under 14 days old");
          }
          else {
            console.error(error);
          }
        });
      // .catch(console.error);
    }
  }
}
