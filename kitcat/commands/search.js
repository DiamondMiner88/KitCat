const Discord = require("discord.js");
const { default: fetch } = require("node-fetch");
const search_embed = new Discord.MessageEmbed()
                    .setTitle(":mag: Search Help")
                    .addField("Minecraft", `Get information about a Minecraft user.`)

module.exports = {
    command: 'search',
    category: require('./_CATEGORIES.js').utils,
    help_name: `:mag: Search`,
    help_description: `Search multiple accounts for games/social platforms.`,
    usage: `search {username or help for help}`,
    guildOnly: false,
    unlisted: true,

    execute(message, args) {
        if (args[0] === "minecraft") {
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle(`User "${args[1]}"`)
                .setColor("#5E9D34")
                // .setThumbnail(`https://minotar.net/helm/${args[1]}/100.png`)
                .setImage(`https://minotar.net/armor/body/${args[1]}/100.png`)
                .setDescription(`[Download Skin](https://minotar.net/download/${args[1]})\n[NameMC](https://namemc.com/profile/${args[1]})`)
            );
        }
    }
};