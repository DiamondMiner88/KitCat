const config = require('../config/config.json');
const pfx = config.prefix;
const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  command: 'doggo',
  category: require('./_CATEGORIES.js').fun,
  help_name: `:dog: Doggo`,
  help_description: `Get a photo of a doggo using this command!\n\`oof doggo {optional: breed | example: retriever}\``,
  guildOnly: false,
  unlisted: false,

  execute(client, message, args) {
    if (args.length === 0) {
      // Get random doggo
      fetch("https://dog.ceo/api/breeds/image/random", {method: 'Get'})
        .then(res => res.json())
        .then((json) => {
          return message.channel.send(new Discord.MessageEmbed()
            .setColor('#aa6c39')
            .setTitle('Here\'s A Doggo For You!')
            .setImage(json['message'])  
          );
        })
    }
    fetch(`https://dog.ceo/api/breed/${encodeURIComponent(args[0])}/images/random`)
      .then(res => res.json())
      .then((json) => {
        // console.log(json)
        if(json['error']) {
          return message.channel.send(json['message'])
        }
        // console.log(json['message'])
        const embed = new Discord.MessageEmbed()
            .setColor('#aa6c39')
            .setTitle(`Here's A Photo Of A "${args.join(' ')}"`)
            .setImage(json['message']);
        return message.channel.send(embed)
      });
  }
};
