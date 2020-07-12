const config = require("../config.json");
const pfx = config.prefix;
const Discord = require("discord.js");
const fs = require('fs');
const {
  imageHash
} = require('image-hash');

module.exports = {
  command: "blacklist",
  category: "utils",
  help_name: `Blacklist commands`,
  help_description: `For more commands on the blacklist do\n\`${pfx}blacklist help\``,

  execute(client, message, args) {
    fs.exists('image-blacklist.json', function(exists) {
      if (!exists) {
        fs.writeFile('image-blacklist.json', JSON.stringify({}), 'utf8', function(writeErr) {
          if (writeErr) throw writeErr;
        });
      }
    });

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
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
          message.channel.send("You do not have the MANAGE_MESSAGES permission.");
          return;
        }
        if (message.attachments.size === 0) {
          message.channel.send("You didnt provide an image attachment to blacklist.");
          return;
        }
        var url = message.attachments.first().url;
        var reason = (args.length === 0 ? "None" : args.join(" "));

        fs.readFile('image-blacklist.json', function readFileCallback(readErr, data) {
          if (readErr) throw readErr;
          const imageBlacklist = JSON.parse(data);
          imageHash(url, 16, true, (hashErr, hash) => {
            if (hashErr) throw hashErr;
            imageBlacklist[hash] = {
              "link": url,
              "reason": reason,
              "author_id": message.author.id
            }
            fs.writeFile('image-blacklist.json', JSON.stringify(imageBlacklist), 'utf8', function(writeErr) {
              if (writeErr) throw writeErr;
              var m = message.channel.send('Image added to blacklist')
                .then(msg => msg.delete({
                  timeout: 10000
                }));;
              setTimeout(function() {
                message.delete();
              }, 10000);
            });
          });
        });
      }
      else if (subcommand2 === "list") {
        var embed = new Discord.MessageEmbed()
          .setColor(0x0099ff)
          .setTitle("Blacklisted images:");
        fs.readFile('image-blacklist.json', function readFileCallback(err, data) {
          if (err) throw err;
          const imageBlacklist = JSON.parse(data);

          for (const hash in imageBlacklist) embed.addField(hash, `[Link to the image](${imageBlacklist[hash].link})\nReason: \`${imageBlacklist[hash].reason}\`\nWho blacklisted it: <@${imageBlacklist[hash].author_id}>`);
          message.author.send(embed);
          message.delete();
        });
      }
      else if (subcommand2 === "remove") {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
          message.channel.send("You do not have the MANAGE_MESSAGES permission.");
          return;
        }
        message.channel.send("this command is in progress. ask diamondminer88 to remove it");
      }
      else if (args.length === 0) message.channel.send("You didn't provide a valid subcommand")
    }
    else message.channel.send(`You didnt provide a valid subcommand! Do \`${pfx}blacklist help\` for subcommands`);
  }
}
