const config = require("../../config.json");
const pfx = config.prefix;
const Discord = require("discord.js");

module.exports = {
  minecraft: function(client, message, args) {
    // https://minecraftskinstealer.com/achievement/3/title/content
    if (args.length < 2) {
      return message.channel.send("You didn't provide the description.");
    }
    // `https://minecraftskinstealer.com/achievement/3/Achievement%20Get%21/${encodeURIComponent(args.slice(1, args.length).join(" "))}`
    return message.channel.send(new Discord.MessageEmbed()
      .setImage(`https://minecraftskinstealer.com/achievement/3/Achievement%20Get%21/${encodeURIComponent(args.slice(1, args.length).join(" "))}`)
      .setColor("#32CD32")
    );
  }
}
