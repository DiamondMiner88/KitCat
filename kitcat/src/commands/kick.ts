import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import { userBypass } from '../util/utils';

export class Kick extends Command {
    executor = 'kick';
    category = 'moderation';
    display_name = '🦵 Kick';
    description = `Used to kick members.`;
    usage = '{Mention | UserID} [reason]';
    guildOnly = true;
    unlisted = false;
    nsfw = false;

    async run(message: Discord.Message, args: string[], settings: IGuildSettings) {
        if (!message.member.hasPermission('KICK_MEMBERS') && !userBypass(message.author.id))
            return message.channel.send(`You can't kick people!`);

        if (args.length === 0) return message.channel.send('Invalid arguments!\n' + this.getUsage(settings));

        let t: Discord.GuildMember;
        try {
            t = await (message.mentions.members.first() ||
                message.guild.members.fetch(args[0]) ||
                message.guild.members.cache.find((member) => member.user.tag === args.join(' ')));
            if (!t) return message.channel.send(`Couldn't find a user by \`${args[0]}\``);
        } catch (error) {
            return message.channel.send(`Couldn't find a user by \`${args[0]}\``);
        }

        args.shift();

        const reason = args.length > 0 ? args.join(' ') : 'None';
        if (!message.guild.member(t).kickable)
            return message.channel.send('I am unable to ban the user because of missing permissions.');

        const logMsg = new Discord.MessageEmbed()
            .setTitle(`*${t.user.username} got yeeted out the window*`)
            .setColor(0xf9f5ea)
            .addField('User kicked', `<@${t.id}>`)
            .addField('Kicked By', `<@${message.author.id}>`)
            .addField('Time', message.createdAt)
            .addField('Reason', reason);

        const uGotKicked = new Discord.MessageEmbed()
            .setTitle(`You got yeeted from \`${message.guild.name}\``)
            .setColor(0xf9f5ea)
            .addField('Kicked By', `<@${message.author.id}>`)
            .addField('Time', message.createdAt)
            .addField('Reason', reason);

        message.channel.send(logMsg).catch(() => undefined);
        t.send(uGotKicked).catch(() => undefined);

        t.ban({
            reason,
        }).catch((err) => message.channel.send(`Error kicking user: ${err.message}`));
    }
}
