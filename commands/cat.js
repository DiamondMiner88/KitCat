const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    command: 'cat',
    category: require('./_CATEGORIES.js').fun,
    help_name: `:cat: Cat`,
    help_description: `Get a photo/gif of a cat!`,
    usage: `cat {optional: tag | examples: cute or gif}`,
    guildOnly: false,
    unlisted: true,

    execute(client, message, args) {
        message.channel.send('This comamnd has not been made yet.')
    }
};
