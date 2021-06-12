import dateFormat from 'dateformat';
import { MessageEmbed, version as DJSversion } from 'discord.js';
import { Module, ModuleCategory } from '../modules';
import { code, dateFormatStr, emojis, duration, makeKVList } from '../utils';
import { freemem, loadavg } from 'os';
import { KCommandInteraction } from '../base';

export default class extends Module {
  name = 'stats';
  description = `Display various information about me.`;
  category = ModuleCategory.GENERAL;
  guildOnly = false;
  options = [];

  timingResponse =
    "you think this is funny, don't you? well how would you like to sit 24/7 in front of a screen responding to messages on discord? oh wait, you already do that " +
    emojis.omegalul;

  async invoke(interaction: KCommandInteraction): Promise<any> {
    const start = Date.now();
    await interaction.reply(this.timingResponse);
    const elapsed = (Date.now() - start) / 2;

    const user = interaction.client.user;

    const tzOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const createdAt = `\`${dateFormat(user.createdTimestamp, dateFormatStr)} (UTC)\` (${duration(
      Date.now() - tzOffset - user.createdTimestamp
    )} Ago)`;

    const embed = new MessageEmbed()
      .setTitle('Stats')
      .addField(
        '❯ Info',
        makeKVList(
          ['Owner', `[Github](${process.env.npm_package_author_url})`, true],
          ['Support', `[Invite](https://www.youtube.com/watch?v=dQw4w9WgXcQ)`, true],
          ['Discord.js', DJSversion],
          ['Node.js', process.version]
        )
      )
      .addField('❯ Ping', makeKVList(['Heartbeat', interaction.client.ws.ping + 'ms'], ['API', ~~elapsed + 'ms']))
      .addField(
        '❯ Process',
        makeKVList(
          ['Memory', ~~(process.memoryUsage().rss / 1e6) + '/' + ~~(freemem() / 1e6) + 'mb'],
          ['Uptime', duration(process.uptime() * 1000), true],
          ['CPU', process.platform !== 'win32' ? code(loadavg().join('% ')) : 'Not available.', true]
        )
      )
      .addField('❯ User', makeKVList(['Username', user.tag], ['ID', user.id], ['Created', createdAt, true]));

    if (interaction.guild) {
      const timestamp = (await interaction.guild.members.fetch(interaction.client.application.id))
        .joinedTimestamp as number;
      const joinedAt =
        code(dateFormat(timestamp, dateFormatStr), '(UTC)') + `(${duration(Date.now() - tzOffset - timestamp)} Ago)`;

      embed.addField('❯ Server', makeKVList(['Shard ID', interaction.guild.shard.id], ['Joined', joinedAt, true]));
    }

    //@ts-expect-error Types should allow null for content
    interaction.editReply({ content: null, embeds: [embed] });
  }
}
