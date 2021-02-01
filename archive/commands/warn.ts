import Discord from 'discord.js';
import { Command, Categories } from '../commands';
import { db } from '../prisma';
import { devPerms } from '../util/utils';
import { GuildMessage } from '../types';

export default class Warn extends Command {
    trigger = 'warn';
    category = Categories.MODERATION;
    name = `⚠️ Warn`;
    description = `Joins your VC and says what you want it to say!`;
    usage = '{ Mention | UserID } [reason]';
    guildOnly = true;
    unlisted = false;
    nsfw = false;

    async invoke(message: GuildMessage, args: string[]): Promise<any> {
        if (!message.member.hasPermission('KICK_MEMBERS') && !devPerms(message.author.id)) {
            return message.channel.send(`You don't have the perms to run this command`);
        }

        if (args.length === 0) return message.channel.send('Invalid arguments!\n' + this.formattedUsage);

        let t: Discord.GuildMember | undefined;
        try {
            t = await (message.mentions.members?.first() || message.guild?.members.fetch(args[0]));
        } catch (error) {
            return message.channel.send(`Couldn't find a user by \`${args[0]}\``);
        }
        if (!t) return message.channel.send(`Couldn't find a user by \`${args[0]}\``);

        args.shift();

        db.prepare('INSERT OR IGNORE INTO users (guild, user) VALUES(?, ?)').run(message.guild.id, t.id);
        db.prepare('UPDATE users SET warns = warns + 1 WHERE guild=? AND user=?').run(message.guild.id, t.id);

        const row = db.prepare('SELECT warns FROM users WHERE guild=? AND user=?').get(message.guild.id, message.author.id);

        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('Warning | Case ' + row.warns)
                .setColor(0xffff00)
                .setDescription(`**Offender**: ${t}\n**Reason**: ${args.join(' ')}\n**Warn Issuer**: ${message.author}`)
                .setColor(0xf9f5ea)
                .setTimestamp()
        );
    }
}
