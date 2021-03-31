import { Collection, CommandInteraction } from 'discord.js';
import { Module, ModuleCategory } from '../modules';

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
      options: undefined,
    },
  ];

  async invoke(interaction: CommandInteraction, options: Collection<string, any>) {
    interaction.reply(options.get('text'), { allowedMentions: { parse: [] } });
  }
}
