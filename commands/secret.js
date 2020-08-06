module.exports = {
    command: 'secret',
    category: require('./_CATEGORIES.js').fun,
    help_name: `Secret`,
    help_description: `Secret command`,
    usage: `secret`,
    guildOnly: false,
    unlisted: true,
  
    execute(client, message, args) {
        message.channel.send('You found a secret command!')
    }
  };
  