import dateFormat from 'dateformat';
import { MessageEmbed, version as DJSversion } from 'discord.js';
import { Module, ModuleCategory } from '../modules';
import { dateFormatStr, emojis, msToUI } from '../utils';
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
    const createdAt = `\`${dateFormat(user.createdTimestamp, dateFormatStr)} (UTC)\` (${msToUI(
      Date.now() - tzOffset - user.createdTimestamp
    )} Ago)`;

    const embed = new MessageEmbed()
      .setTitle('Stats')
      .addField(
        '❯ Info',
        `• Owner: [Github](${process.env.npm_package_author_url})` +
          `\n• Support server: [Invite](https://www.youtube.com/watch?v=dQw4w9WgXcQ)` +
          `\n• Discord.js: \`${DJSversion}\`` +
          `\n• Node.js: \`${process.version}\``
      )
      .addField('❯ Ping', `• Heatbeat: \`${interaction.client.ws.ping}ms\`` + `\n• API: \`${~~elapsed}ms\``)
      .addField(
        '❯ Process',
        `\n• Memory: \`${~~(process.memoryUsage().rss / 1e6)}/${~~(freemem() / 1e6)}mb\`` +
          `\n• Uptime: ${msToUI(process.uptime() * 1000)}` +
          `\n• CPU: ${process.platform !== 'win32' ? '`' + loadavg().join('% ') + '`' : 'Not available.'}`
      )
      .addField('❯ User', `• Username: \`${user.tag}\`` + `\n• ID: \`${user.id}\`` + `\n• Created: ${createdAt}`);

    if (interaction.guild) {
      const timestamp = (await interaction.guild.members.fetch(interaction.client.application.id))
        .joinedTimestamp as number;
      const joinedAt =
        `\`${dateFormat(timestamp, dateFormatStr)} (UTC)\`` + ` (${msToUI(Date.now() - tzOffset - timestamp)} Ago)`;

      embed.addField('❯ Server', `• Shard ID: \`${interaction.guild.shard.id}\`` + `\n• Joined: ${joinedAt}`);
    }

    //@ts-expect-error Types should allow null for content
    interaction.editReply({ content: null, embeds: [embed] });
  }
}
