var database = require('../db.js');
var db = database.db;
const Discord = require('discord.js');

/**
 * timestampToStr - Makes a Unix timestamp into a readable date and time
 *
 * @param  {Number} UNIX_timestamp
 * @returns {String}
 */
function timestampToStr(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
  command: 'balance',
  category: require('./_CATEGORIES.js').oofcoin,
  help_name: `Oof coin Balance`,
  help_description: `Gets the your or the mention user's global balance of oof coin.`,
  usage: `balance {optional: mention | username#discriminator}`,
  guildOnly: false,
  unlisted: false,

  /**
   * execute - Gets the user's bank balance that is in args[0]
   *
   * @param  {String} args [{Mention | User tag}]
   * @returns {void}
   */
  execute(message, args) {
    let target_user = message.mentions.users.first();
    if (!args[0]) target_user = message.author;
    else if (!target_user) {
      let matching_users = message.client.users.cache.filter(
        (user) => user.username === args[0].split('#')[0]
      );
      target_user = matching_users.find((user) => user.discriminator === args[0].split('#')[1]);
      if (!target_user) {
        message.channel.send('Member to kick not found.');
        return;
      }
    }

    database.checkForProfile(target_user);

    db.get(
      'SELECT bank, daily_last_claimed_at FROM currency WHERE user=?',
      [target_user.id],
      (err, result) => {
        if (err) {
          console.log('Error retrieving currency data: ' + err.message);
          message.channel.send('Something went wrong trying to retrieve the data.');
        } else {
          var embed = new Discord.MessageEmbed()
            .setColor(0x0099ff)
            .setTitle('Balance')
            .addField('Bank Balance', `${Math.floor(result.bank)}©`);
          message.channel.send(embed);
        }
      }
    );
  }
};
