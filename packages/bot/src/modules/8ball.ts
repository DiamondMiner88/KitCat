import { CommandInteraction } from 'discord.js';
import { Module, ModuleCategory, OptionString } from '../modules';

export default class extends Module {
  name = '8ball';
  description = 'Ask me anything!';
  category = ModuleCategory.GENERAL;
  guildOnly = false;
  options: any = [
    {
      type: 'STRING',
      name: 'question',
      description: 'The question you want me to asnwer.',
      required: true,
      default: undefined,
      choices: undefined,
      options: undefined
    }
  ];

  eightballReplies = [
    'It is certain.',
    'Without a doubt. ',
    'Yes - definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Outlook good.',
    'Signs point to yes.',
    `Don't count on it.`,
    'My sources say no.',
    'Outlook not so good.',
    'x to doubt',
    'https://i.redd.it/qh7mgkucu2y21.jpg'
  ];

  async invoke(interaction: CommandInteraction, { question: { value } }: { question: OptionString }): Promise<any> {
    interaction.reply(`> ${value}\n` + this.eightballReplies[Math.floor(Math.random() * this.eightballReplies.length)]);
  }
}
