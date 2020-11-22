import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';

export class Pfp extends Command {
    executor = 'avatar';
    category = 'util';
    display_name = 'Profile Picture';
    description = `Get the profile picture of a user.`;
    usage = '{Mention | UserID | user#0000}';
    guildOnly = true;
    unlisted = false;
    nsfw = false;

    run(message: Discord.Message, args: string[], settings: IGuildSettings) {
        if (args.length === 0) return message.channel.send('Invalid arguments!\n' + this.getUsage(settings));

        const t: Discord.GuildMember =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find((member) => member.user.tag === args.join(' '));

        if (!t) return message.channel.send(`Couldn't find a user by \`${args[0]}\``);
        const embed = new Discord.MessageEmbed()
            .setTitle(`${t.user.tag}'s avatar`)
            .setColor(0xf9f5ea)
            .addField(
                'PNG Format',
                `[64px](${t.user.displayAvatarURL({ size: 64, format: 'png', dynamic: true })}) | ` +
                    `[256px](${t.user.displayAvatarURL({ size: 256, format: 'png', dynamic: true })}) | ` +
                    `[1024px](${t.user.displayAvatarURL({ size: 1024, format: 'png', dynamic: true })})`
            )
            .setImage(t.user.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }));
        message.channel.send(embed);
    }
}
