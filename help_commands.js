const config = require("./config.json");
const pfx = config.prefix;

function help_commands(message, command, args) {
  if (args[0] === undefined) {
    message.channel.send({
      embed: {
        color: 0x0099ff,
        title: 'Command List',
        fields: [{
            name: `:tools: Moderation`,
            value: `Used for moderating the server!\n\`${pfx}help moderation\``
          },
          {
            name: `:smile: Fun`,
            value: `'Fun' commands\n\`${pfx}help fun\``
          }
        ],
        timestamp: new Date(),
        footer: {
          text: `${message.author.tag} Executed: \`${message.content}\``,
          icon_url: message.author.avatarURL
        }
      }
    });
  }
  else if (args[0].toLowerCase() === "moderation") {
    message.channel.send({
      embed: {
        color: 0x0099ff,
        title: ':tools: Moderation Commands',
        fields: [
          {
            name: `:arrows_counterclockwise: Unban`,
            value: `Used to unban banned users.\n\`${pfx}unban {user}\` **WIP**`
          },
          {
            name: 'fix later',
            value: 'fix later'
          }
        ],
        timestamp: new Date(),
        footer: {
          text: `${message.author.tag} Executed: \`${message.content}\``,
          icon_url: message.author.avatarURL
        }
      }
    });
  }
  else if (args[0].toLowerCase() === "fun") {
    message.channel.send({
      embed: {
        color: 0x0099ff,
        title: ':smile: Fun',
        fields: [
          {
            name: `fix this later`,
            value: `fix this later`
          }
        ],
        timestamp: new Date(),
        footer: {
          text: `${message.author.tag} Executed: \`${message.content}\``,
          icon_url: message.author.avatarURL
        }
      }
    });
  }
  else if (args[0].toLowerCase() === "soundboard") {
    message.channel.send({
      embed: {
        color: 0x0099ff,
        title: ':loud_sound: Audio Clips',
        fields: [{
            name: `:expressionless: Bruh`,
            value: `\`${pfx}soundboard bruh\``
          },
          {
            name: `:peanuts: Deez nuts`,
            value: `\`${pfx}soundboard deez nuts\``
          },
          {
            name: `( -_-)︻デ═一 Get noscoped`,
            value: `\`${pfx}soundboard get noscoped\``
          },
          {
            name: `:ok_hand: Gotcha bitch`,
            value: `\`${pfx}soundboard gotcha bitch\``
          },
          {
            name: `△ Illuminati`,
            value: `\`${pfx}soundboard illuminati\``
          },
          {
            name: `Just do it`,
            value: `\`${pfx}soundboard just do it\``
          },
          {
            name: `Surprise motherfucker`,
            value: `\`${pfx}soundboard surprise motherfucker\``
          },
          {
            name: `且_(ﾟ◇ﾟ)ノ Tadah`,
            value: `\`${pfx}soundboard tadah\``
          },
          {
            name: `(✘ㅿ✘) Wasted`,
            value: `\`${pfx}soundboard wasted\``
          },
          {
            name: `:violin: Sad violin`,
            value: `\`${pfx}soundboard sad violin\``
          },
          {
            name: `:stop_button: Stop`,
            value: `\`${pfx}soundboard stop\``
          },
          {
            name: `Enemy spotted`,
            value: `\`${pfx}soundboard enemy spotted\``
          },
          {
            name: `:woman_running: Why are you running`,
            value: `\`${pfx}soundboard why are you running\``
          },
          {
            name: `:man_in_tuxedo: Objection`,
            value: `\`${pfx}soundboard objection\``
          },
          {
            name: `Mmm whatcha say`,
            value: `\`${pfx}soundboard mmm whatcha say\``
          },
          {
            name: `Mission Failed`,
            value: `\`${pfx}soundboard mission failed\``
          },
          {
            name: `Deja Vu`,
            value: `\`${pfx}soundboard deja vu\``
          },
          {
            name: `:gun: Gunshot`,
            value: `\`${pfx}soundboard gunshot\``
          },
          {
            name: `No God no please no`,
            value: `\`${pfx}soundboard no god no\``
          },
          {
            name: `(⌐▀͡ ̯ʖ▀)︻̷┻̿═━一- F.B.I open up`,
            value: `\`${pfx}soundboard fbi open up\``
          },
          {
            name: `Oof`,
            value: `\`${pfx}soundboard oof\``
          },
          {
            name: `:man_judge: Law in order`,
            value: `\`${pfx}soundboard law in order\``
          },
          {
            name: `:drum: Joke drum`,
            value: `\`${pfx}soundboard joke drum\``
          },
          {
            name: `Shut up`,
            value: `\`${pfx}soundboard shut up\``
          },
          {
            name: `:bell: Discord notification`,
            value: `\`${pfx}soundboard discord notification\``
          }
        ],
        timestamp: new Date(),
        footer: {
          text: `${message.author.tag} Executed: \`${message.content}\``,
          icon_url: message.author.avatarURL
        }
      }
    })
  }
}

module.exports = {
  help_commands
};
