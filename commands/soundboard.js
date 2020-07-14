const config = require("../config.json");
const pfx = config.prefix;
const Discord = require('discord.js');

async function play_audio(audio_path, message) {
  const connection = await message.member.voice.channel.join();
  const dispatcher = connection.play("./audio/" + audio_path.file);
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
  help_description: `Plays audio clips.\n\`${pfx}soundboard {audio clip}\`\nRun \`oof soundboard help\` for help with audio clips`,

  execute(client, message, args) {
    console.log(args);
    if (args[0] === "help") {
      let sounds = config.sound_effects;
      let embed = new Discord.MessageEmbed()
        .setColor(0x0099ff)
        .setTitle(":loud_sound: Audio Clips")
      for (sound in sounds) {
        embed.addField(sounds[sound].help_name, sounds[sound].help_description.replace("${pfx}", pfx));
      }
      return message.channel.send(embed);
    }
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
