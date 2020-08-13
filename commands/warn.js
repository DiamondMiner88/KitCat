const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const { db } = require('../db.js');

const get_warning = `SELECT warns FROM users WHERE guild=? AND user=?`;

const add_user = `INSERT OR IGNORE INTO users (guild, user) VALUES(?, ?)`;

const update_warnings = `UPDATE users SET warns = warns + 1 WHERE guild=? AND user=?`;

module.exports = {
  command: 'warn',
  category: require('./_CATEGORIES.js').moderation,
  help_name: `:warning: Warn`,
  help_description: `Warn a user.`,
  usage: `warn {mention | username#discriminator} {reason}`,
  guildOnly: false,
  unlisted: false,

  execute(client, message, args) {
    if (message.mentions.users.first === undefined) {
      return message.channel.send("You didn't provide a user to warn idiot.");
    }
    if (args.length == 1) {
      return message.channel.send("You didn't provide a reason for the warn.");
    }
    if (message.mentions.users.first().id === message.author.id) {
      return message.channel.send('Why are you trying to warn yourself.');
    }
    db.get(get_warning, [message.guild.id, message.author.id], (err, result) => {
      if (err) {
        console.log('Error trying to get warnings: ' + err);
      } else if (result === undefined) {
        db.run(add_user, [message.guild.id, message.author.id], (err) => {
          if (err) console.log(`Error adding user: ${err}`);
        });
      }
      db.run(update_warnings, [message.guild.id, message.author.id], (err) => {
        if (err) console.log('Error updating warning: ' + err);
        else {
          db.get(get_warning, [message.guild.id, message.author.id], (err, result) => {
            if (err) console.log('Error getting values for warning: ' + err);
            return message.channel.send(
              new Discord.MessageEmbed()
                .setTitle('Warning | Case ' + result.warns)
                .setDescription(
                  `**Offender**: ${message.mentions.users.first()}\n**Reason**: ${args
                    .splice(1, args.length - 1)
                    .join(' ')}\n**Warn Issuer**: ${message.author}`
                )
                .setColor('#eed202')
                .setTimestamp()
            );
          });
        }
      });
    });
    /*
        db.get(get_warning, [message.guild.id, message.author.id], (err, result) => {
                            console.log(result)
                        });
        */
  }
};
