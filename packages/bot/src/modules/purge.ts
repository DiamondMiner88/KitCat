import { CommandInteraction, Permissions, TextChannel } from 'discord.js';
import { Module, ModuleCategory, OptionInteger } from '../modules';
import { clamp } from '../utils';

export default class extends Module {
  name = 'purge';
  description = 'Purge messages from this channel. Max is 100 and messages older than 14 days will be skipped.';
  category = ModuleCategory.MODERATION;
  guildOnly = true;
  advancedPermissions = true;
  userPermissions = [Permissions.FLAGS.MANAGE_MESSAGES];

  options: any = [
    {
      type: 'INTEGER',
      name: 'amount',
      description: 'Quantity of messages for to delete.',
      required: true,
      default: undefined,
      choices: undefined,
      options: undefined
    }
  ];

  async invoke(interaction: CommandInteraction, { amount: { value } }: { amount: OptionInteger }): Promise<any> {
    const amount = clamp(value, 1, 100);
    (interaction.channel as TextChannel).bulkDelete(amount, true).then(
      messages => {
        // TODO: log to logChannel
        interaction.client.setTimeout(
          () => interaction.reply(`Deleted ${messages.size} messages.`, { ephemeral: true }),
          2000
        );
      },
      error =>
        interaction.client.setTimeout(
          () => interaction.reply(`Failed to purge because of ${error.message}`, { ephemeral: true }),
          2000
        )
    );
  }
}
