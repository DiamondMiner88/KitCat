const config = require("./config.json");
const pfx = config.prefix;

function moderation_commands(message, command, args) {
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
}

module.exports = {
  moderation_commands
};
