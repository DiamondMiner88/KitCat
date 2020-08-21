const Discord = require('discord.js');
const fetch = require('node-fetch');

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
   * @param {Discord.TextChannel} message
   * @param {Array.<String>} args
   */
  execute(message, args) {
    if (args.length === 0) {
      return message.channel.send("You didn't provide a Minecraft username.");
    }
    fetch(`https://minotar.net/armor/body/${args[0]}/100.png`, { method: 'HEAD' }).then((res) => {
      if (res.ok) {
        return message.channel.send(
          new Discord.MessageEmbed()
            .setTitle(`User "${args[0]}"`)
            .setColor('#5E9D34')
            .setImage(`https://minotar.net/armor/body/${args[0]}/100.png`)
            .setDescription(
              `[Download Skin](https://minotar.net/download/${args[0]})\n[NameMC](https://namemc.com/profile/${args[0]})`
            )
        );
      }
      return message.channel.send(`Invalid user: ${args[0]}`);
    });
  }
};
