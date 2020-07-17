const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");
var {
  db
} = require("../db.js");
const currency = require("../oofcoin.js");
const Discord = require("discord.js");

module.exports = {
  command: "deposit",
  category: categories.oofcoin,
  help_name: `Deposit`,
  help_description: `Deposit oofcoin into your bank\n\`${pfx}deposit {coin amnt}\``,

  execute(client, message, args) {
    if (!args[0]) return message.channel.send("You didn't provide a number of coins to deposit!");
    if (isNaN(args[0])) return message.channel.send("The amount you said to deposit is not a number!");

    currency.checkForProfile(message.author);

    db.get("SELECT * FROM currency WHERE user=?", [message.author.id], (err, result) => {
      if (err) {
        console.log("Error retrieving currency data: " + err);
        message.channel.send("Something went wrong trying to retrieve the data.");
      }
      else if (result.purse < Number(args[0])) message.channel.send("Your purse does not contain enough coins!");
      else {
        db.run("UPDATE currency SET bank = bank + ?, purse = purse - ? WHERE user = ?", [Number(args[0]), Number(args[0]), message.author.id], (err) => {
          if (err) {
            console.log("Error trying to deposit coins: " + err);
            message.channel.send("Something went wrong trying to update the data.")
          }
          else {
            message.channel.send("Successfully deposited " + args[0] + " coins! Your bank contains " + (Math.floor(result.bank) + (Number(args[0]))) + " coins now.");
          }
        });
      }
    });
  }
}
