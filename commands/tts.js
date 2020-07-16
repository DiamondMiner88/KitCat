const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");

module.exports = {
  command: "tts",
  category: categories.utils,
  help_name: `:robot: TTS`,
  help_description: `Joins VC and says what you want it to say!\n\`${pfx}tts {text}\``,

  async execute(client, message, args) {
    var channel = message.member.voice.channel;
    if (message.member.voice.channel) {
      if (args.join(" ").length > 200) {
        message.channel.send("Text exceeds 200 character limit.");
        return;
      }
      const channel = message.member.voice.channel;
      const connection = await message.member.voice.channel.join();
      var url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(args.join(" "))}&tl=en&client=tw-ob`;
      // message.channel.send(url);
      const dispatcher = connection.play(url);
      dispatcher.on("finish", () => {
        channel.leave();
      })
      /*
      var url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(args.join(" "))}&tl=en&client=tw-ob`;
      var options = {
          url: url,
          headers: {
              'Referer': 'http://translate.google.com/',
              'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)'
          }
      }
      // var filename = `${message.author.id}.[${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}][${new Date().getHours()}-${new Date().getMinutes()}-${new Date().getSeconds()}-${new Date().getMilliseconds()}`
      var filename = `${message.author.id}.${new Date().getTime()}.mp3`
      request(options).pipe(fs.createWriteStream(`./audio/tts-audio-files/${filename}`));
      const dispatcher = connection.play(`./audio/tts-audio-files/${filename}`);
      dispatcher.end("end", end => {
          channel.leave();
      });
      */
    }
    else {
      message.channel.send("You aren't in a voice channel!");
    }
  }
}
