const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  command: 'dog',
  category: require('./_CATEGORIES.js').fun,
  help_name: `:dog: Doggo`,
  help_description: `Get a photo of a doggo using this command!`,
  usage: `dog {optional: breed | example: retriever}`,
  guildOnly: false,
  unlisted: false,

  execute(message, args) {
    if (args.length === 0) {
      // Get random doggo
      fetch('https://dog.ceo/api/breeds/image/random', { method: 'Get' })
        .then((res) => res.json())
        .then((json) => {
          return message.channel.send(
            new Discord.MessageEmbed()
              .setColor('#aa6c39')
              .setTitle("Here's A Doggo For You!")
              .setImage(json['message'])
          );
        });
    }
    fetch(`https://dog.ceo/api/breed/${encodeURIComponent(args[0])}/images/random`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) return message.channel.send(json.message);
        const embed = new Discord.MessageEmbed()
          .setColor('#aa6c39')
          .setTitle(`Here's A Photo Of A "${args.join(' ')}"`)
          .setImage(json.message);
        return message.channel.send(embed);
      });
  }
};