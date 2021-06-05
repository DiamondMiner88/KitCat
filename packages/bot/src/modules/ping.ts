import dateFormat from 'dateformat';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Module, ModuleCategory } from '../modules';
import { dateFormatStr, msToUI } from '../utils';
import { freemem } from 'os';

export default class extends Module {
  name = 'ping';
  description = `Get the bot's stats.`;
  category = ModuleCategory.GENERAL;
  guildOnly = false;
  options = [];

  async invoke(interaction: CommandInteraction): Promise<any> {
    const start = Date.now();
    await interaction.reply(`no.`);
    const elapsed = Date.now() - start;

    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

    const user = interaction.client.user!;

    const createdAt = `\`${dateFormat(user.createdTimestamp, dateFormatStr)} (UTC)\` (${msToUI(
      Date.now() - timezoneOffset - user.createdTimestamp
    )} Ago)`;

    const embed = new MessageEmbed()
      .setAuthor('Stats')
      .addField('❯ Ping', `• Heatbeat: ${interaction.client.ws.ping}ms\n• Round-Trip: ${elapsed}ms`)
      .addField(
        '❯ Process',
        `\n• Memory: ${Math.floor(process.memoryUsage().rss / 1e6)}/${Math.floor(freemem() / 1e6)}mb` +
          `\n• Uptime: ${msToUI(process.uptime() * 1000)}`
      )
      .addField(
        '❯ User',
        `• Username: \`${user.tag}\`` +
          `\n• ID: \`${user.id}\`` +
          `\n• Created: ${createdAt}` +
          `\n• Owner: [Github](https://github.com/DiamondMiner88)`
      );

    const joinedTimestamp = interaction.guild!.me!.joinedTimestamp!;
    const joinedAt =
      `\`${dateFormat(joinedTimestamp, dateFormatStr)} (UTC)\`` +
      ` (${msToUI(Date.now() - timezoneOffset - joinedTimestamp)} Ago)`;

    if (interaction.guild)
      embed.addField('❯ Guild', `• Shard ID: ${interaction.guild.shard.id}` + `\n• Joined: ${joinedAt}`);

    // ZWS until I can pass in null again
    interaction.editReply({ content: '\u200b', embeds: [embed] });
  }
}
