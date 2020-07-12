const config = require("../config.json");
const pfx = config.prefix;
const Discord = require("discord.js");
const request = require("request");
const fetch = require('node-fetch');
// const snoowrap = require('snoowrap');
// const pSearch = require("pornsearch");

/*
https://pornopics.co/
*/

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

const help = [
    {
        name: ":hot_face: Hentai",
        description: `Gives a gif or image out of a category of Hentai. \`${pfx}nsfw hentai {type}\`. Run \`${pfx}nsfw hentai help\` for all the available categories.`
    },
    {
        name: ":play_pause: Video Custom Search",
        description: `Gives a small video clip that lasts around 5 seconds long. (WITH AUDIO)`
    }
]

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
        if (args[0].toLowerCase() === "help") {
            const hEmbed = new Discord.MessageEmbed()
                .setColor("#FF69B4")
                .setTitle("Help")
                .setTimestamp()
                .setFooter(`${message.author.tag} ran the commnd`, message.author.avatarURL())
            for (var items in help) {
                hEmbed.addField(items.name, items.description);
            }
            // console.log( message.author.avatarURL);
            message.channel.send(hEmbed);
        }

        if (args[0].toLowerCase() === "gif") {
            // const search = require('pornsearch')
            // const searcher = search.search(args.slice(1, args.length).join(" "), driver="Sex");
            // console.log(searcher.gifUrl())
            searcher.gifs()
                .then(gifs => {
                    var random = gifs.slice(1, gifs.length)[Math.floor(Math.random() * gifs.length)];
                    message.channel.send(`Title: \`${random.title}\`\n${random.url}`);
                });
            return;
        }

        if (args[0].toLowerCase() === "hentai"){
            if (args[1] == "help") {
                message.channel.send(`Here are your options: \`${hentai_commands.join(", ")}\``);
                return;
            }
            if (!hentai_commands.includes(args[2])) {
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
        }
    }
}