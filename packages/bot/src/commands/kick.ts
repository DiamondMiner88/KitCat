import Discord, { Permissions } from 'discord.js';
import { Command, Categories } from '../commands';
import { NOOP, devPerms, hasPermission } from '../util/utils';

export default class Kick extends Command {
  trigger = 'kick';
  category = Categories.MODERATION;
  name = 'Ban';
  description = `Used to kick members.`;
  usage = '{ Mention | UserID } [reason]';
  guildOnly = true;
  unlisted = false;
  nsfw = false;

  async invoke(message: Discord.Message, args: string[]): Promise<any> {
    if (!hasPermission(message.member!, Permissions.FLAGS.KICK_MEMBERS)) return message.channel.send(`You cannot kick people!`);

    if (args.length === 0) return message.channel.send('Invalid arguments!\n' + this.formattedUsage);

    let t: Discord.GuildMember | undefined;
    try {
      t = await (message.mentions.members?.first() || message.guild?.members.fetch(args[0]));
    } catch {
      return message.channel.send(`Couldn't find a user by \`${args[0]}\``);
    }
    if (!t) return message.channel.send(`Couldn't find a user by \`${args[0]}\``);

    args.shift();

    if (!t.bannable) return message.channel.send(`I don't have the permission to kick that user! Check my permissions, or my role in the hierarchy.`);

    const reason = `Banned by ${message.author.tag} with ` + (args.length > 0 ? `reason "${args.join(' ')}".` : 'no reason.');

    const logMsg = new Discord.MessageEmbed()
      .setTitle(`*${t.user.username} got yeeted out the window*`)
      .setDescription(`ID: ${t.id}`)
      .setColor(0xf9f5ea)
      .addField('User kicked', `${t}`)
      .addField('Kicked By', `${message.author}`)
      .addField('Reason', reason);

    const uGotBanned = new Discord.MessageEmbed()
      .setTitle(`You got kicked from \`${message.guild?.name}\``)
      .setColor(0xf9f5ea)
      .addField('Kicked By', `${message.author}`)
      .addField('Reason', reason);

    message.channel.send(logMsg).catch(NOOP);
    await t.send(uGotBanned).catch(NOOP);

    t.ban({
      reason,
    }).catch(err => message.channel.send(`Couldn't kick the user: ${err.message}`));
  }
}
