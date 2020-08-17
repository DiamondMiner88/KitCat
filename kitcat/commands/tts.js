module.exports = {
  command: 'tts',
  category: require('./_CATEGORIES.js').utils,
  help_name: `:robot: TTS`,
  help_description: `Joins VC and says what you want it to say!`,
  usage: `tts {text}`,
  guildOnly: true,
  unlisted: false,

  async execute(message, args) {
    if (!message.member.voice.channel)
      return message.channel.send('You are not in a voice channel!');
    if (!message.member.roles.cache.some((role) => role.name === 'DJ'))
      return message.channel.send('You do not have the DJ role!');

    const text = args.join(' ');

    // if (text.length > 200) return message.channel.send('Text exceeds 200 character limit.');
    const channel = message.member.voice.channel;
    const connection = await message.member.voice.channel.join();
    var url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text
    )}&tl=en&client=tw-ob`;
    const dispatcher = connection.play(url);
    dispatcher.on('finish', () => {
      channel.leave();
    });
  }
};
