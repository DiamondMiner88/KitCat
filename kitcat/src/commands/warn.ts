import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import { db } from '../db';
import { userBypass } from '../util/permissions';

export class Warn extends Command {
    executor = 'warn';
    category = 'moderation';
    display_name = `⚠️ Warn`;
    description = `Joins your VC and says what you want it to say!`;
    usage = '{Mention | UserID} [reason]';
    guildOnly = true;
    unlisted = false;
    nsfw = false;

    run(message: Discord.Message, args: string[], settings: IGuildSettings) {
        if (!message.member.hasPermission('KICK_MEMBERS') && !userBypass(message.author.id)) {
            return message.channel.send(`You don't have the perms to run this command`);
        }

        if (args.length === 0) return message.channel.send('Invalid arguments!\n' + this.getUsage(settings));

        const t: Discord.GuildMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!t) return message.channel.send(`Couldn't find a user by \`${args[0]}\``);

        args.shift();

        db.prepare('INSERT OR IGNORE INTO users (guild, user) VALUES(?, ?)').run(message.guild.id, t.id);
        db.prepare('UPDATE users SET warns = warns + 1 WHERE guild=? AND user=?').run(message.guild.id, t.id);

        const row = db
            .prepare('SELECT warns FROM users WHERE guild=? AND user=?')
            .get(message.guild.id, message.author.id);

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
