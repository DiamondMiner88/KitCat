const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");
var {
  db
} = require("../db.js");
const currency = require("../oofcoin.js");
const Discord = require("discord.js");

function timestampToStr(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
}

module.exports = {
  command: "balance",
  category: categories.oofcoin,
  help_name: `Oof coin Balance`,
  help_description: `Gets the your or the mention user's global balance of oof coin.\n\`${pfx}balance {optional: mention | username#discriminator}\``,

  execute(client, message, args) {
    let target_user = message.mentions.users.first();
    if (!args[0]) target_user = message.author;
    else if (!target_user) {
      let matching_users = client.users.cache.filter(user => user.username === args[0].split("#")[0]);
      target_user = matching_users.find(user => user.discriminator === args[0].split("#")[1]);
      if (!target_user) {
        message.channel.send('Member to kick not found.');
        return;
      }
    }

    currency.checkForProfile(target_user);

    db.get("SELECT purse, bank, loan_left, loan_due FROM currency WHERE user=?", [target_user.id], (err, result) => {
      if (err) {
        console.log("Error retrieving currency data: " + err);
        message.channel.send("Something went wrong trying to retrieve the data.");
      }
      else {
        var embed = new Discord.MessageEmbed()
          .setColor(0x0099ff)
          .setTitle("Balance")
          .addField("Purse Balance", `${result.purse}©`)
          .addField("Bank Balance", `${Math.floor(result.bank)}©`);
          if (result.loan_left) {
            embed.addField("Loan left to pay", `${result.loan_left}©`);
            embed.addField("When loan due", `${result.loan_left}©`);
          }
        message.channel.send(embed);
      }
    });
  }
}
