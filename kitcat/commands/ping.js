const Discord = require('discord.js');

module.exports = {
  command: 'ping',
  category: require('./_CATEGORIES.js').utils,
  help_name: `Ping`,
  help_description: `Gets my latency and API latency.`,
  usage: `ping`,
  guildOnly: false,
  unlisted: false,

  /**
   * Calculates ping between sending a message and editing it, giving a round-trip latency.
   * The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
   * @param {Discord.Message} message
   */
  async execute(message) {
    let m = await message.channel.send('Ping?');
    m.edit(
      `Pong! Round trip latency is ${
        m.createdTimestamp - message.createdTimestamp
      }ms. One-way API Latency is ${Math.round(message.client.ws.ping)}ms`
    );
  }
};
