const Discord = require('discord.js');
const fetch = require('node-fetch');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

module.exports = {
  command: 'namemc',
  category: require('./_CATEGORIES.js').utils,
  help_name: `Minecarft User Search`,
  help_description: `See user's skin, download it, and view them on NameMC.`,
  usage: `namemc {username}`,
  guildOnly: false,
  unlisted: false,

  /**
   * Shows info about the target Minecraft username
   * @param {Discord.Message} message
   * @param {Array.<String>} args
   */
  execute(message, args) {
    if (!args[0]) return message.channel.send("You didn't provide a username.");
    fetch(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`)
      .then((res) => res.json())
      .then((user) => {
        fetch(`https://api.mojang.com/user/profiles/${user.id}/names`)
          .then((res) => res.json())
          .then((names) => {
            let embed = new Discord.MessageEmbed()
              .setTitle(user.name)
              .setDescription('Usernames:')
              .setColor(0x00aa00)
              .setURL(`https://namemc.com/profile/${user.name}`)
              .setImage(`https://minotar.net/armor/body/${user.name}/100.png`);

            if (names.error)
              message.channel.send(
                names.errorMessage +
                  '\nPlease try again in a few seconds. I have no idea why this happens. Will try to fix later.'
              );
            else {
              for (const name of names) {
                const date = dayjs(name.changedToAt).utc().format('MMM D, YYYY h:mm:ss A');
                embed.addField(
                  name.name.replace('_', '\\_'),
                  name.changedToAt ? (date + ' UTC').replace('_', '\\_') : 'Initial name'
                );
              }
              message.channel.send(embed);
            }
          })
          .catch((error) => {
            message.channel.send(error.message);
          });
      })
      .catch((error) => {
        if (error.message.startsWith('invalid json response body at'))
          message.channel.send('This this not a valid user!');
        else {
          console.error(error.message);
          message.channel.send(error.message);
        }
      });
  }
};
