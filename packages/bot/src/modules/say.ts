import { CommandInteraction } from 'discord.js';
import { Module, ModuleCategory, OptionString } from '../modules';

export default class extends Module {
  name = 'say';
  description = 'Make me say something!';
  category = ModuleCategory.GENERAL;
  guildOnly = false;

  options: any = [
    {
      type: 'STRING',
      name: 'text',
      description: 'Text for me to send!',
      required: true,
      default: undefined,
      choices: undefined,
      options: undefined
    }
  ];

  async invoke(interaction: CommandInteraction, { text: { value } }: { text: OptionString }): Promise<any> {
    interaction.reply({ content: value, allowedMentions: { parse: [] } });
  }
}
