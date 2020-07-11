const config = require("../config.json");
const pfx = config.prefix;
const Discord = require("discord.js");
const request = require("request");

const hentai_commands = ['classic', 'erofeet', 'erok',
                        'les', 'hololewd', 'lewdk', 
                        'keta', 'feetg', 'nsfw_neko_gif', 'eroyuri', 'kiss', 
                        'kuni', 'tits', 'pussy_jpg', 'cum_jpg', 'pussy', 'lewdkemo', 
                        'lizard', 'slap', 'lewd', 'cum', 'cuddle', 'spank', 'smallboobs', 
                        'Random_hentai_gif', 'fox_girl', 'nsfw_avatar', 
                        'gecg', 'boobs', 'feet', 'kemonomimi', 'solog', 
                        'bj', 'yuri', 'trap', 'anal', 
                        'blowjob', 'holoero', 'neko', 'hentai', 'futanari', 
                        'ero', 'solo', 'waifu', 'pwankg', 'eron', 'erokemo']

module.exports = {
    command: "nsfw",
    category: "fun",
    help_name: ":smirk: NSFW",
    help_description: `Get NSFW photos, and gifs. \n\`${pfx}nsfw {type}\``,

    execute(client, message, args) {
        if (!message.channel.nsfw) {
            message.channel.send("This command can only be run in channels marked NSFW.");
            return;
        }
        // message.channel.send(args);
        if (args[0].toLowerCase() === "hentai"){
            if (args[1] == "help") {
                message.channel.send(`Here are your options: \`${hentai_commands.join(", ")}\``);
                return;
            }
            if (!hentai_commands.includes(args[2]) && args.length > 2) {
                message.channel.send(`You didn't provide a valid hentai type. Run \`${pfx}nsfw hentai help\``);
                return;
            }
            var url = "";
            if (args.length < 2) {
                url = `https://nekos.life/api/v2/img/Random_hentai_gif`;
            } else {
                url = `https://nekos.life/api/v2/img/${args[1]}`;
            }
            request({
                url: url,
                json: true
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) { 
                    const hEmbed = new Discord.MessageEmbed()
                        .setColor("#FF69B4")
                        .setTitle("Here's some hentai")
                        .setImage(body.url)
                        .setTimestamp()
                        .setFooter(`${message.author.tag} ran the commnd | Content gotten from nekos.life`, message.author.avatarURL())
                    // console.log( message.author.avatarURL);
                    message.channel.send(hEmbed);
                }
            });
        } else {
            if (args.length == 0) {
                // get stuff from https://www.reddit.com/r/nsfw/
                return;
            }
            if (args[0].toLowerCase() === "gay") {
                // get stuff from https://www.reddit.com/r/GaybrosGoneWild/
                return;
            }
            if (args[0].toLowerCase() === "trans") {
                // get stuff from https://www.reddit.com/r/GoneWildTrans/
                return;
            }
            if (args[0].toLowerCase() === "cosplay") {
                // get stuff from https://www.reddit.com/r/nsfwcosplay/
                return;
            }
        }
    }
}