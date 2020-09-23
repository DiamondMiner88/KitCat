import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import { userBypass } from '../util/permissions';

export class Kick extends Command {
  constructor() {
    super();
    this.executor = 'kick';
    this.category = 'moderation';
    this.display_name = '🦵 Kick';
    this.description = `Used to kick members.`;
    this.usage = '{Mention | UserID} [reason]';
    this.guildOnly = true;
    this.unlisted = false;
    this.nsfw = false;
  }

  run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    if (!message.member.hasPermission('KICK_MEMBERS') && !userBypass(message.author.id))
      return message.channel.send(`You can't kick people!`);

    if (args.length === 0)
      return message.channel.send('Invalid arguments!\n' + this.getUsage(settings));

    const t: Discord.GuildMember =
      message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!t) return message.channel.send(`Couldn't find a user by \`${args[0]}\``);

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

    message.channel.send(logMsg).catch(err => {});
    t.send(uGotKicked).catch(err => {});

    t.ban({
      reason: reason
    }).catch(err => message.channel.send(`Error kicking user: ${err.message}`));
  }
}
