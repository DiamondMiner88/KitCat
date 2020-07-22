const pfx = require("../config/config.json").prefix;
const Discord = require("discord.js");
const fs = require('fs');
const {
  imageHash
} = require('image-hash');
var {
  db
} = require("../db.js");

module.exports = {
  command: "blacklist",
  category: require("./_CATEGORIES.js").moderation,
  help_name: `Blacklist commands`,
  help_description: `For more commands on the blacklist do\n\`${pfx}blacklist help\``,
  guildOnly: true,
  unlisted: false,

  execute(client, message, args) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      message.channel.send("You do not have permission to do this.");
      return;
    }
    const subcommand = args.shift();
    if (subcommand === "help") {
      var embed = new Discord.MessageEmbed()
        .setColor(0x0099ff)
        .setTitle("Blacklist commands:")
        .addField("image", `\`${pfx}blacklist image help\``);
      message.channel.send(embed);
    }
    else if (subcommand === "image") {
      const subcommand2 = args.shift();
      if (subcommand2 === "help") {
        var embed = new Discord.MessageEmbed()
          .setColor(0x0099ff)
          .setTitle("Image blacklist commands:")
          .addField("help", `What you're looking at right now\n\`${pfx}blacklist image help\``)
          .addField("add", `Add an image to the blacklist. **Requires an attachment thats an image**\n\`${pfx}blacklist image add {optional: reason}\``)
          .addField("list", `List all the blacklisted images\n\`${pfx}blacklist image list\``)
          .addField("remove", `Remove a image from the blacklist. **Requires an attachment thats an image**\n\`${pfx}blacklist image remove\``);
        message.channel.send(embed);
      }
      else if (subcommand2 === "add") {
        if (message.attachments.size === 0) {
          message.author.send("You didn't provide an image attachment to blacklist.");
          message.delete();
          return;
        }

        var url = message.attachments.first().url;
        var reason = (args.length === 0 ? "None" : args.join(" "));

        imageHash(url, 16, true, (hashErr, hash) => {
          if (hashErr) throw hashErr;
          db.run("INSERT OR IGNORE INTO image_blacklist(hash, guild, user, reason, url) VALUES(?, ?, ?, ?, ?)", [hash, message.guild.id, message.author.id, reason, url], (err) => {
            if (err) console.log("Error trying to add image to blacklist: " + err);
            else {
              message.author.send("Successfully blacklisted image!");
              message.delete();
            }
          });
        });
      }
      else if (subcommand2 === "list") {
        var embed = new Discord.MessageEmbed()
          .setColor(0x0099ff)
          .setTitle("Blacklisted images:");

        db.all("SELECT hash, user, reason, url FROM image_blacklist WHERE guild=?", [message.guild.id], (err, results) => {
          if (err) {
            console.log("Error trying to add image to blacklist: " + err);
            message.author.send("Something went wrong trying to retrieve the data.");
            message.delete();
          }
          else {
            results.forEach(result => {
              embed.addField(result.url, `Reason: \`${result.reason}\`\nWho blacklisted it: <@${result.user}>`);
            })
            message.author.send(embed);
            message.delete();
          }
        });
      }
      else if (subcommand2 === "remove") {
        if (message.attachments.size === 0) {
          message.author.send("You didn't provide an image attachment to remove from the blacklist.");
          message.delete();
          return;
        }

        imageHash(message.attachments.first().url, 16, true, (hashErr, hash) => {
          if (hashErr) throw hashErr;
          db.run("DELETE FROM image_blacklist WHERE hash=?", [hash], (err) => {
            if (err) {
              console.log("Error trying to remove image from blacklist: " + err);
              message.author.send("Something went wrong trying to delete data.");
              message.delete();
            }
            else {
              message.author.send("Successfully removed the image from the blacklist!");
              message.delete();
            }
          });
        });
      }
      else if (args.length === 0) message.channel.send("You didn't provide a subcommand");
    }
    else message.channel.send(`You didnt provide a valid subcommand! Do \`${pfx}blacklist help\` for subcommands`);
  }
}
