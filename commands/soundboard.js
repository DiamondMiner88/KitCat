const config = require("../config.json");
const pfx = config.prefix;

async function play_audio(audio_path, message) {
  const connection = await message.member.voice.channel.join();
  console.log(audio_path);
  const dispatcher  = connection.play("./audio/"+audio_path.file);
  dispatcher.resume();
  dispatcher.on('finish', () => {
    dispatcher.destroy();
    connection.disconnect();
  })
}

module.exports = {
  command: "soundboard",
  category: "fun",
  help_name: `:loud_sound: Soundboard`,
  help_description: `Plays audio clips.\n\`${pfx}soundboard {audio clip}\`\nRun \`oof help soundboard\` for help with audio clips`,

  execute(client, message, args) {
    if (message.member.voice.channel) {
      if (args[0] === undefined) {
        message.channel.send("You didn't provide an audio clip to play.")
        return;
      }
      const argsStr = args.join(" ");
      if (config.sound_effects[args.join(" ")] === undefined) {
        message.channel.send("You didn't provide a valid audio clip!");
        return;
      }
      play_audio(config.sound_effects[args.join(" ")], message);
    }
    else {
      message.reply("You need to join a VC first!")
    }
  }
}
