const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  command: 'pet',
  category: require('./_CATEGORIES.js').fun,
  help_name: `:hotdog: Pet`,
  help_description: `Get a photo/gif of kitties, dogs or other cute pets!`,
  usage: `pet [{animal} | help]`,
  guildOnly: false,
  unlisted: true,

  /**
   * Get a image of a pet
   * @param {Discord.Message} message
   * @param {Array.<String>} args
   */
  async execute(message, args) {
    const pfx = message.client.guildSettingsCache.get(message.guild.id).prefix;
    if (args.length === 0)
      return message.channel.send(`What pet do you want? \`${pfx}${this.command}pet {animal}\``);
    const subcommand = args.shift();
    switch (subcommand) {
      case 'help':
        return message.channel.send(
          new Discord.MessageEmbed()
            .setTitle('Supported pets')
            .addField(':cat: Cat', `\`${pfx}${this.command}pet cat\``)
            .addField(':dog: Doggo', `\`${pfx}${this.command}pet dog\``)
        );
      case 'cat':
      case 'kitty':
        return message.channel.send('No cat images for now! Coming very soon!');
      case 'dog':
        const res = await fetch('https://dog.ceo/api/breeds/image/random');
        const json = await res.json();
        console.log(json);
        if (json.status !== 'success') {
          console.error('Dog image api error!');
          console.error(json);
          return message.channel.send(
            'An error occured with the dog api we used! This error was reported!'
          );
        }
        return message.channel.send(
          new Discord.MessageEmbed()
            .setColor('#aa6c39')
            .setTitle("Here's A Doggo For You!")
            .setImage(json.message)
        );
    }
  }
};
