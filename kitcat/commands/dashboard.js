const Discord = require('discord.js');

module.exports = {
  command: 'dashboard',
  category: require('./_CATEGORIES.js').utils,
  help_name: `Dashboard`,
  help_description: `Link to this server's dashboard.`,
  usage: `dashboard`,
  guildOnly: true,
  unlisted: false,

  /**
   * @param {Discord.Message} message
   */
  execute(message) {
    const url = `https://kitcat-bot.github.io/KitCat/#/guild/${message.guild.id}`;
    const embed = new Discord.MessageEmbed()
      .setTitle('Dashboard')
      .setURL(url)
      .setTimestamp()
      .setDescription('ill change make this look nicer later');
    message.channel.send(embed);
  }
};
