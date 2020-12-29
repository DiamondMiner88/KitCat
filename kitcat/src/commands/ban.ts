import Discord from 'discord.js';
import { Command, Categories } from '../commands';
import { NOOP, devPerms } from '../util/utils';

export default class Ban extends Command {
    trigger = 'ban';
    category = Categories.MODERATION;
    name = '⛔ Ban';
    description = `Used to ban members.`;
    usage = '{ Mention | UserID } [reason]';
    guildOnly = true;
    unlisted = false;
    nsfw = false;

    async invoke(message: Discord.Message, args: string[]): Promise<any> {
        if (!message.member?.hasPermission('BAN_MEMBERS') && !devPerms(message.author.id)) return message.channel.send(`You cannot ban people!`);

        if (args.length === 0) return message.channel.send('Invalid arguments!\n' + this.formattedUsage);

        let t: Discord.GuildMember | undefined;
        try {
            t = await (message.mentions.members?.first() || message.guild?.members.fetch(args[0]));
        } catch {
            return message.channel.send(`Couldn't find a user by \`${args[0]}\``);
        }
        if (!t) return message.channel.send(`Couldn't find a user by \`${args[0]}\``);

        args.shift();

        if (!t.bannable) return message.channel.send(`I don't have the permission to ban that user! Check my permissions, or my role in the hierarchy.`);

        const reason = `Banned by ${message.author.tag} with ` + (args.length > 0 ? `reason "${args.join(' ')}".` : 'no reason.');

        const logMsg = new Discord.MessageEmbed()
            .setTitle(`*${t.user.username} got yeeted out the window*`)
            .setDescription(`ID: ${t.id}`)
            .setColor(0xf9f5ea)
            .addField('User banned', `${t}`)
            .addField('Banned By', `${message.author}`)
            .addField('Reason', reason);

        const uGotBanned = new Discord.MessageEmbed()
            .setTitle(`You got banned from \`${message.guild?.name}\``)
            .setColor(0xf9f5ea)
            .addField('Banned By', `${message.author}`)
            .addField('Reason', reason);

        message.channel.send(logMsg).catch(NOOP);
        await t.send(uGotBanned).catch(NOOP);

        t.ban({
            reason,
        }).catch(err => message.channel.send(`Couldn't ban the user: ${err.message}`));
    }
}
