import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';

export class DashBoard extends Command {
    executor = 'dashboard';
    category = 'kitcat';
    display_name = 'Dashboard';
    description = `Link to this server's dashboard.`;
    usage = '';
    guildOnly = true;
    unlisted = true;
    nsfw = false;

    // run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    //     const url = `https://kitcat-bot.github.io/KitCat/#/guild/${message.guild.id}`;
    //     const embed = new Discord.MessageEmbed()
    //       .setTitle('Dashboard')
    //       .setURL(url)
    //       .setTimestamp()
    //       .setDescription('ill change make this look nicer later')
    //       .setColor(0xf9f5ea);
    //     message.channel.send(embed);
    // }
}
