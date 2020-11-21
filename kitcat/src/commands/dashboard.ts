import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';

export class DashBoard extends Command {
    constructor() {
        super();
        this.executor = 'dashboard';
        this.category = 'kitcat';
        this.display_name = 'Dashboard';
        this.description = `Link to this server's dashboard.`;
        this.usage = '';
        this.guildOnly = true;
        this.unlisted = false;
        this.nsfw = false;
    }

    run(message: Discord.Message, args: string[], settings: IGuildSettings) {
        // const url = `https://kitcat-bot.github.io/KitCat/#/guild/${message.guild.id}`;
        // const embed = new Discord.MessageEmbed()
        //   .setTitle('Dashboard')
        //   .setURL(url)
        //   .setTimestamp()
        //   .setDescription('ill change make this look nicer later')
        //   .setColor(0xf9f5ea);
        // message.channel.send(embed);
        message.channel.send('The dashboard is temporarily disabled until my authors can finish it!');
    }
}
