const fetch = require("node-fetch");
const config = require("./config.json");
const pfx = config.prefix;
const reddit_funcs = require("./reddit.js");

async function fun_commands(message, command, args) {
  if (command === 'avatar') {
    if (args[0] === undefined) {
      message.channel.send(`You need to mention someone or put their username#discriminator`);
      return;
    }
    let target_user = message.mentions.users.first();
    if (!target_user) {
      let matching_users = client.users.cache.filter(user => user.username === args[0].split("#")[0]);
      target_user = matching_users.find(user => user.discriminator === args[0].split("#")[1]);
      if (!target_user) {
        message.channel.send('Member not found');
        return;
      }
    }
    message.channel.send({
      embed: {
        color: 0x0099ff,
        title: 'Avatar',
        fields: [{
          name: `${target_user.tag}'s Avatar`,
          value: target_user.avatarURL({
            format: "png"
          })
        }],
        image: {
          url: target_user.avatarURL({
            format: "png"
          })
        },
        timestamp: new Date(),
        footer: {
          text: `${message.author.tag} Executed: \`${message.content}\``,
          icon_url: message.author.avatarURL
        }
      }
    });
  }
  else if (command === "meme") {
    reddit_funcs.getTopPost(message, config.memes_subreddit);
  }
  else if (command === "subreddit") {
    if (args[0] === undefined) {
      message.channel.send(`Missing subreddit`);
      return;
    }
    reddit_funcs.getTopPost(message, args[0]);
  }
  else if (command === "soundboard") {
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
      // play_audio(, message)
    }
    else {
      message.reply("You need to join a VC first!")
    }
  }
  else if (command === "8ball") {
    if (args !== undefined) {
      message.channel.send(`Question: ${args.join(" ")}\nAnswer: ${config.eight_ball_replies[Math.floor(Math.random()*config.eight_ball_replies.length)]}`);
    }
    else {
      message.channel.send(`You didn't ask a question`);
    }
  }
  else if (command === "quote") {
    // https://github.com/lukePeavey/quotable#readme
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    message.channel.send(`"${data.content}"\n- ${data.author}`);
  }
}

async function play_audio(audio_path, message) {
  const connection = await message.member.voice.channel.join();
  const dispatcher  = connection.play("./audio/"+audio_path);
  dispatcher.resume();
  dispatcher.on('finish', () => {
    dispatcher.destroy();
    connection.disconnect();
  })
}

module.exports = {
  fun_commands
};
