const Discord = require('discord.js');

module.exports = {
  command: 'serverinfo',
  category: require('./_CATEGORIES.js').utils,
  help_name: `Server`,
  help_description: `Gives information on the server.`,
  usage: `server`,
  guildOnly: false,
  unlisted: false,

  execute(message) {
    const userCount = message.guild.members.cache.filter((member) => !member.user.bot).size;
    const botCount = message.guild.members.cache.filter((member) => member.user.bot).size;
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTitle('Server Information')
        .setDescription(`Information on **${message.guild.name}**.`)
        .setThumbnail(message.guild.iconURL())
        .addFields(
          {
            name: 'Server Size',
            value: `Users in server: ${userCount}\nBots in server: ${botCount}`
          },
          { name: 'Created At', value: new Date(message.guild.createdAt).toUTCString() }
        )
    );
  }
};
