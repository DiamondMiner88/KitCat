import { settings } from 'cluster';
import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import { TextChannel } from 'discord.js';

const fetch = require('node-fetch');

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


export class NSFW extends Command {
  constructor() {
    super();
    this.executor = 'nsfw';
    this.category = 'fun';
    this.display_name = '🎱 8Ball';
    this.description = 'Ask the 8ball a question, and it will give you an answer.';
    this.usage = '{question}';
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
      case 'hentai':
        if (args[1] === 'help') {
          message.channel.send(`Here are your options: \`${hentai_commands.join(', ')}\``);
          return;
        }
        if (!hentai_commands.includes(args[1])) {
          message.channel.send(
            `You didn't provide a valid hentai type. Run \`${prefix}nsfw hentai help\``
          );
          return;
        }
        var url = '';
        if (args.length < 2) {
          url = `https://nekos.life/api/v2/img/Random_hentai_gif`;
        } else {
          url = `https://nekos.life/api/v2/img/${args[1]}`;
        }
        var res = await fetch(url);
        var json = await res.json();
        return message.channel.send(new Discord.MessageEmbed()
          .setColor('#FF69B4')
          .setTitle("Here's some Hentai")
          .setImage(json.url)
          .setTimestamp()
          .setFooter(
            `${message.author.tag} ran the commnd | Content gotten from nekos.life`,
            message.author.avatarURL()
          )
        );
    }
  }
}
