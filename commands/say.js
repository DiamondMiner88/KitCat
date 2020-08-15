module.exports = {
  command: 'say',
  category: require('./_CATEGORIES.js').fun,
  help_name: `:speaking_head: Say`,
  help_description: `Make the bot say whatever you want!`,
  usage: `say {message}`,
  guildOnly: false,
  unlisted: false,

  execute(message, args) {
    if (args.length === 0) message.author.send("You didn't provide a message to say!");
    else message.channel.send(args.join(' '));
    message.delete();
  }
};
