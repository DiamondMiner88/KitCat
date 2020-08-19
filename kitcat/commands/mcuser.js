const Discord = require("discord.js");

module.exports = {
    command: 'mcuser',
    category: require('./_CATEGORIES.js').utils,
    help_name: `Minecarft User Search`,
    help_description: `See user's skin, download it, and view them on NameMC.`,
    usage: `mcuser {username}`,
    guildOnly: false,
    unlisted: false,

    execute(message, args) {
        return message.channel.send(new Discord.MessageEmbed()
            .setTitle(`User "${args[0]}"`)
            .setColor("#5E9D34")
            // .setThumbnail(`https://minotar.net/helm/${args[1]}/100.png`)
            .setImage(`https://minotar.net/armor/body/${args[0]}/100.png`)
            .setDescription(`[Download Skin](https://minotar.net/download/${args[0]})\n[NameMC](https://namemc.com/profile/${args[1]})`)
        );
    }
};