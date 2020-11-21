import { settings } from 'cluster';
import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import { TextChannel } from 'discord.js';
import { showCompletionScript, strict } from 'yargs';

const fetch = require('node-fetch');

const PH = require('pornhub.js');
const phub = new PH();

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
  'erokemo',
  'ass',
  'thighs',
  'panties',
  'feet'
];

const DABI_OPTIONS = [
  'ass',
  'thighs',
  'panties',
  'feet'
];

// const NSFW_HELP = {
//   "hentai": {
//     extension: "hentai",
//     description: "Gives Hentai images/gifs",
//     usuage: "{hentai category | help}"
//   }
// }

const NSFW_HELP = new Discord.MessageEmbed()
  .setTitle("NSFW Help")
  .addFields(
    { name: 'Hentai', value: 'Gives Hentai imgages/gifs\n``hentai {category}``' },
    { name: 'Search', value: 'Search for videos/images/gifs\n``search {type: video/gif/album/pornstar} {query}``' }
  );

export class NSFW extends Command {
  constructor() {
    super();
    this.executor = 'nsfw';
    this.category = 'fun';
    this.display_name = '😏 NSFW';
    this.description = 'Get NSFW images/gifs/videos.';
    this.usage = '{help}';
    this.guildOnly = false;
    this.unlisted = false;
    this.nsfw = false;
  }

  async run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    const { prefix } = settings;
    if (!(message.channel as TextChannel).nsfw) {
      return message.channel.send('This command can only be run in channels marked NSFW.');;
    }
    if (args.length === 0) {
      message.channel.send(`No paramaters entered. Run \`${prefix}nsfw help\` for more information.`);
      return;
    }
    switch(args[0].toLowerCase()) {
      case 'search':
        var search = phub.search(args[1].toLowerCase().charAt(0).toUpperCase() + args[1].toLowerCase().slice(1), args.slice(2).join(" "), {})
        if (search === undefined) return message.channel.send("Unknown category or unknown seach.");
        search.then((res: any) => {
          return message.channel.send(res.data[Math.floor(Math.random() * res.data.length)]);
        });
        break;
      case 'hentai':
        if (args[1] === 'help') {
          return message.channel.send(`Here are your options: \`${hentai_commands.join(', ')}\``);
        }
        if (!hentai_commands.includes(args[1])) {
          return message.channel.send(
            `You didn't provide a valid hentai type. Run \`${prefix}nsfw hentai help\``
          );
        }
        var url;
      
        var nekos_url;
        if (args.length < 2) {
          nekos_url = `https://nekos.life/api/v2/img/Random_hentai_gif`;
        } else {
          nekos_url = `https://nekos.life/api/v2/img/${args[1]}`;
        }
        var res = await fetch(nekos_url);
        var json = await res.json();
        url = json.url;
        console.log(url)
        return message.channel.send(new Discord.MessageEmbed()
          .setColor('#FF69B4')
          .setTitle("Here's some Hentai")
          .setImage(url)
          .setTimestamp()
          .setFooter(
            `${message.author.tag} ran the commnd | ❤️ Content gotten from nekos.life ❤️`,
            message.author.avatarURL()
          )
        );
      case 'help':
        return message.channel.send(NSFW_HELP);
    }
  }
}
