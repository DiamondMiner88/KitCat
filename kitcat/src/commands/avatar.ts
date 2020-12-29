import Discord from 'discord.js';
import { Command, Categories } from '../commands';

export default class Avatar extends Command {
    trigger = 'avatar';
    category = Categories.UTIL;
    name = 'Profile Picture';
    description = `Get the profile picture of a user.`;
    usage = '{ Mention | UserID | user#0000 }';
    guildOnly = true;
    unlisted = false;
    nsfw = false;

    async invoke(message: Discord.Message, args: string[]): Promise<any> {
        if (args.length === 0) return message.channel.send('Invalid arguments!\n' + this.usage);

        let t: Discord.GuildMember | undefined;
        try {
            const tag = args.join(' ').split('#');
            t = await (message.mentions.members?.first() ||
                message.guild?.members.fetch(args[0]) ||
                (await message.guild?.members.fetch({ limit: Infinity, query: tag[0] }))?.find(m => m.user.discriminator === tag[1]));
        } catch (error) {
            return message.channel.send(`Couldn't find a user by \`${args[0]}\``);
        }
        if (!t) return message.channel.send(`Couldn't find a user by \`${args[0]}\``);

        const embed = new Discord.MessageEmbed()
            .setTitle(`${t.user.tag}'s avatar`)
            .setColor(0xf9f5ea)
            .addField(
                'PNG/GIF Format',
                `[64px](${t.user.displayAvatarURL({ size: 64, format: 'png', dynamic: true })}) | ` +
                    `[256px](${t.user.displayAvatarURL({ size: 256, format: 'png', dynamic: true })}) | ` +
                    `[512px](${t.user.displayAvatarURL({ size: 512, format: 'png', dynamic: true })}) | ` +
                    `[1024px](${t.user.displayAvatarURL({ size: 1024, format: 'png', dynamic: true })})`
            )
            .addField(
                'JPG/GIF Format',
                `[64px](${t.user.displayAvatarURL({ size: 64, format: 'jpg', dynamic: true })}) | ` +
                    `[256px](${t.user.displayAvatarURL({ size: 256, format: 'jpg', dynamic: true })}) | ` +
                    `[512px](${t.user.displayAvatarURL({ size: 512, format: 'jpg', dynamic: true })}) | ` +
                    `[1024px](${t.user.displayAvatarURL({ size: 1024, format: 'jpg', dynamic: true })})`
            )
            .setImage(t.user.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }));
        message.channel.send(embed);
    }
}
