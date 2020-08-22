const Discord = require('discord.js');
const pfx = process.env.BOT_PREFIX;
const fetch = require('node-fetch');

// https://pornopics.co/

const hentai_commands = [
  'classic',
  'erofeet',
  'erok',
  'les',
  'hololewd',
  'lewdk',
  'keta',
  'feetg',
  'nsfw_neko_gif',
  'eroyuri',
  'kiss',
  'kuni',
  'tits',
  'pussy_jpg',
  'cum_jpg',
  'pussy',
  'lewdkemo',
  'lizard',
  'slap',
  'lewd',
  'cum',
  'cuddle',
  'spank',
  'smallboobs',
  'Random_hentai_gif',
  'fox_girl',
  'nsfw_avatar',
  'gecg',
  'boobs',
  'feet',
  'kemonomimi',
  'solog',
  'bj',
  'yuri',
  'trap',
  'anal',
  'blowjob',
  'holoero',
  'neko',
  'hentai',
  'futanari',
  'ero',
  'solo',
  'waifu',
  'pwankg',
  'eron',
  'erokemo'
];

const help = [
  {
    name: ':hot_face: Hentai',
    description: `Gives a gif or image out of a category of Hentai.\n\`${pfx}nsfw hentai {type}\`. Run \`${pfx}nsfw hentai help\` for all the available categories.`
  },
  {
    name: ':paperclip: Custom Clip Search',
    description: `Gives a small video clip (WITH AUDIO).\n\`${pfx}nsfw clip {query}\``
  },
  {
    name: ':play_pause: Video',
    description: `Sends embed with title of video, thumbnail (Doesn't work sometimes), and link. \`${pfx}nsfw video {query}\``
  }
];

  /**
   * Idk the specifics of this
   * @param {Discord.TextChannel} message
   * @param {Array.<String>} args
   */
module.exports = {
  command: 'nsfw',
  category: require('./_CATEGORIES.js').fun,
  help_name: `:smirk: NSFW`,
  help_description: `Get NSFW photos, and gifs.`,
  usage: `nsfw help`,
  guildOnly: false,
  unlisted: false,

  execute(message, args) {
    if (!message.channel.nsfw) {
      message.channel.send('This command can only be run in channels marked NSFW.');
      return;
    }
    if (args.length === 0) {
      message.channel.send(`No paramaters entered. Run \`${pfx}nsfw help\` for more information.`);
      return;
    }
    if (args[0].toLowerCase() === 'help') {
      const hEmbed = new Discord.MessageEmbed().setColor('#FF69B4').setTitle('Help');
      for (var items in help) {
        hEmbed.addField(help[items].name, help[items].description);
      }
      message.channel.send(hEmbed);
    }
    if (args[0].toLowerCase() === 'clip') {
      const search = require('pornsearch');
      const searcher = search.search(args.slice(1, args.length).join(' '));
      searcher.gifs().then((gifs) => {
        var random = gifs.slice(1, gifs.length)[Math.floor(Math.random() * gifs.length)];
        message.channel.send(`Title: \`${random.title}\`\n${random.webm}`);
      });
      return;
    }
    if (args[0].toLowerCase() === 'video') {
      const search = require('pornsearch');
      const searcher = search.search(args.slice(1, args.length).join(' '), (driver = 'sex'));
      searcher.videos().then((gifs) => {
        var random = gifs.slice(1, gifs.length)[Math.floor(Math.random() * gifs.length)];
        var embed = new Discord.MessageEmbed()
          .setTitle(random.title.replace(/\n/gm, '').replace(/\ {2,}/gm, ' '))
          .setColor('#FF69B4')
          .setImage(random.thumb)
          .addField('Video Link', random.url)
          .setTimestamp()
          .setFooter(`${message.author.tag} ran the commnd`, message.author.avatarURL());
        message.channel.send(embed);
      });
      return;
    }
    if (args[0].toLowerCase() === 'hentai') {
      if (args[1] === 'help') {
        message.channel.send(`Here are your options: \`${hentai_commands.join(', ')}\``);
        return;
      }
      if (!hentai_commands.includes(args[1])) {
        message.channel.send(
          `You didn't provide a valid hentai type. Run \`${pfx}nsfw hentai help\``
        );
        return;
      }
      var url = '';
      if (args.length < 2) {
        url = `https://nekos.life/api/v2/img/Random_hentai_gif`;
      } else {
        url = `https://nekos.life/api/v2/img/${args[1]}`;
      }
      fetch(url)
        .then(res => res.text())
        .then(body => {
          const hEmbed = new Discord.MessageEmbed()
              .setColor('#FF69B4')
              .setTitle("Here's some hentai")
              .setImage(body.url)
              .setTimestamp()
              .setFooter(
                `${message.author.tag} ran the commnd | Content gotten from nekos.life`,
                message.author.avatarURL()
              );
            return message.channel.send(hEmbed);
        });
    }
  }
};
