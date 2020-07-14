const config = require("../config.json");
const pfx = config.prefix;
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

module.exports = {
    // command: "youtube",
    // category: "fun",
    // help_name: `YouTube`,
    // help_description: `Play YouTube videos in Discord\n\`${pfx}youtube help\``,

    async execute(client, message, args) {
        if (args.length === 0) {
            message.channel.send(`No paramaters entered. Run \`${pfx}youtube help\` for more information.`);
            return;
        }
        // console.log(args);
        if (args[0].toLowerCase() === "help") {
            message.channel.send(new Discord.MessageEmbed()
                .setTitle("YouTube Help")
                .addField(":arrow_forward: Play", `Plays YouTube video.\n\`${pfx}youtube play {link}\``)
                .addField(":stop_button: Stop/Leave", `Stops video and leaves the voice channel.\n\`${pfx}youtube stop\` or \`${pfx}youtube leave\``)
            );
            return;
        }
        if (args[0].toLowerCase() === "play") {
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) {
                return message.channel.send("You need to join a voice channel first!");
            }
            try{
                const stream = ytdl(args[1], { filter: 'audioonly' })
                voiceChannel.join().then(connection => {
                    const dispatcher = connection.play(stream);
                    dispatcher.on('finish', () => voiceChannel.leave());
                });
            } catch {
                message.channel.send("Invalid YouTube video!");
                return;
            }
        }
        if (args[0].toLowerCase() === "stop" || args[0].toLowerCase() === "leave") {
            if (!message.member.roles.cache.some(role => role.name.toLowerCase() === "dj")) {
                return;
            }
        }
    }
}
