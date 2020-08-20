const Discord = require('discord.js');

module.exports = {
  command: 'purgechannel',
  category: require('./_CATEGORIES.js').moderation,
  help_name: `:wastebasket: Purge Channel`,
  help_description: `Used to delete to wipe all messages in a channel. ***This command deletes and makes a new channel in the same***`,
  usage: `purgechannel`,
  guildOnly: true,
  unlisted: true,

  execute(message, args) {
    return;
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      message.channel.send('You do not have the permission to manage messages.');
      return;
    }
    message.channel.send('This command is not implemented yet!');
    const position = message.channel.rawPosition;
    message.guild.channels.create(message.channel.name, { reason: `${message.author} purged the channel.` })
      .then((item) => {
        item.overwritePermissions(message.channel.permissionOverwrites);
        message.channel.delete().then().catch(err => {console.log(err)});
        item.setParent(message.channel.parent);
        item.setPosition(position)
          .then()
          .catch(err => console.log(err));
      })
      .catch((err) => console.log(err))
  }
};
