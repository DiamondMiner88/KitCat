const fetch = require('node-fetch');

module.exports = {
  command: 'quote',
  category: require('./_CATEGORIES.js').fun,
  help_name: `:innocent: Inspirational Quote`,
  help_description: `Gives an inspirational quote!`,
  usage: `quote`,
  guildOnly: false,
  unlisted: false,

  async execute(message) {
    // https://github.com/lukePeavey/quotable#readme
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    message.channel.send(`"${data.content}"\n- ${data.author}`);
  }
};