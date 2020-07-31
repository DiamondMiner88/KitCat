const pfx = require('../config/config.json').prefix;

module.exports = {
  command: 'ping',
  category: require('./_CATEGORIES.js').utils,
  help_name: `Ping`,
  help_description: `Gets my latency and API latency.\n\`${pfx}ping\``,
  guildOnly: false,
  unlisted: false,

  /**
   * Calculates ping between sending a message and editing it, giving a round-trip latency.
   * The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
   *
   * @returns {void}
   */
  async execute(client, message, args) {
    let m = await message.channel.send('Ping?');
    m.edit(
      `Pong! Round trip latency is ${
        m.createdTimestamp - message.createdTimestamp
      }ms. One-way API Latency is ${Math.round(client.ws.ping)}ms`
    );
  }
};
