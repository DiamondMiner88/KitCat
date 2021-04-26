import { CommandInteraction } from 'discord.js';
import { Module, ModuleCategory, OptionString } from '../modules';
import { devPerms } from '../utils';
import { inspect } from 'util';

export default class extends Module {
  name = 'eval';
  description = `Evaluate some javascript code`;
  category = ModuleCategory.UTILITY;
  guildOnly = false;
  options: any = [
    {
      type: 'STRING',
      name: 'code',
      description: 'Javscript code.',
      required: true,
      default: undefined,
      choices: undefined,
      options: undefined
    }
  ];

  async invoke(interaction: CommandInteraction, { code: { value } }: { code: OptionString }): Promise<any> {
    if (!devPerms(interaction.user.id)) return interaction.reply('You cannot use this command!');

    const clean = (text: string) => (typeof text === 'string' ? text.replace(/`/g, '`\u200b') : text);

    try {
      let evaled = await eval("const Discord=require('discord.js');" + value);
      if (typeof evaled !== 'string') evaled = inspect(evaled);
      interaction.reply(clean(evaled).substring(0, 1990), { code: 'js', allowedMentions: { parse: [] } });
    } catch (error) {
      interaction.reply(clean(error.toString()).substring(0, 1990), { code: 'js', allowedMentions: { parse: [] } });
    }
  }
}
