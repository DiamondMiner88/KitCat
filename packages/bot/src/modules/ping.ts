import { CommandInteraction } from 'discord.js';
import { Module, ModuleCategory } from '../modules';

export default class extends Module {
  name = 'ping';
  description = `Display the bot's ping.`;
  category = ModuleCategory.GENERAL;
  guildOnly = false;
  options: any = [];

  async invoke(interaction: CommandInteraction) {
    // TODO: two way latency
    interaction.reply(`Heartbeat: ${interaction.client.ws.ping}ms`);
  }
}
