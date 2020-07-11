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
        // message.channel.send(args);
        if (args[0].toLowerCase() == "hentai"){
            console.log(args);
            if (!hentai_commands.includes(args[2]) && args.length > 2) {
                message.channel.send("You didn't provide a valid hentai type.");
                return;
            }
            var url = "";
            console.log(args.length);
            if (args.length < 2) {
                url = `https://nekos.life/api/v2/img/Random_hentai_gif`;
            } else {
                url = `https://nekos.life/api/v2/img/${args[1]}`;
            }
            var media_url;
            var testing = request({
                url: url,
                json: true
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) { 
                    const hEmbed = new Discord.MessageEmbed()
                        .setColor("#FF69B4")
                        .setTitle("Hentai")
                        .setImage(body.url)
                    console.log(body.url);
                    message.channel.send(hEmbed);
                }
            });
        }
    }
}