import { Collection, CommandInteraction, Permissions } from 'discord.js';
import { Module, ModuleCategory } from '../modules';

export default class extends Module {
  name = 'steal';
  description = 'Create an emoji using an existing image/emoji.';
  category = ModuleCategory.UTILITY;
  guildOnly = true;
  advancedPermissions = true;
  userPermissions = [Permissions.FLAGS.MANAGE_EMOJIS];
  unlisted = true;

  options: any = [
    {
      type: 'STRING',
      name: 'emoji',
      description: "Use an existing emoji from another server or give it's id",
      required: false,
      default: undefined,
      choices: undefined,
      options: undefined
    },
    {
      type: 'STRING',
      name: 'url',
      description: "Create from url. **Will compress image if it's bigger than 256kb**",
      required: false,
      default: undefined,
      choices: undefined,
      options: undefined
    }
  ];

  async invoke(interaction: CommandInteraction, options: Collection<string, any>): Promise<any> {
    const existingEmoji: string = options.get('emoji');
    const url = options.get('url');

    if (existingEmoji) {
      const res = existingEmoji.match(/\d{17,20}/);
      console.log(res);
    } else if (url) {
      // TODO: create emoji from url
    } else interaction.reply('No paramaters provided!');
  }
}
