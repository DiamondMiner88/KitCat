const Discord = require('discord.js');

module.exports = {
    command: 'warn',
    category: require('./_CATEGORIES.js').moderation,
    help_name: `:warning: Warn`,
    help_description: `Warn a user.`,
    usage: `warn {mention | username#discriminator} {reason}`,
    guildOnly: false,
    unlisted: false,
  
    execute(client, message, args) {
        console.log(message.mentions.users.first())
        if (message.mentions.users.first === undefined) {
            return message.channel.send('You didn\'t provide a user to warn idiot.')
        }
        if (args.length == 1) {
            return message.channel.send('You didn\'t provide a reason for the warn.')
        }
        if (message.mentions.users.first().id === message.author.id) {
            return message.channel.send('Why are you trying to warn yourself.')
        }
        return message.channel.send(new Discord.MessageEmbed()
            .setTitle('Warning')
            .addField('Offender', message.mentions.users.first())
            .addField('Reason', args.splice(1, args.length - 1).join(' '))
            .addField('Warn Issuer', `<@${message.author.id}>`)
        );
    }
  };
  