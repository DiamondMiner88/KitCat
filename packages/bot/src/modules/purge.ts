import { MessageEmbed, Permissions, TextChannel } from 'discord.js';
import { GuildCommandInteraction } from '../base';
import { Module, ModuleCategory, OptionInteger, OptionString } from '../modules';
import { clamp, sendToLogChannel } from '../utils';

export default class extends Module {
  name = 'purge';
  description = 'Purge up to 100 messages from this channel. Messages older than 14 days will be skipped.';
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
    },
    {
      type: 'STRING',
      name: 'reason',
      description: 'Reason for purging the messages.',
      required: false,
      default: undefined,
      choices: undefined,
      options: undefined
    }
  ];

  async invoke(
    interaction: GuildCommandInteraction,
    { amount: { value }, reason }: { amount: OptionInteger; reason?: OptionString }
  ): Promise<any> {
    const amount = clamp(value, 1, 100);
    const logEmbed = new MessageEmbed()
      .setAuthor(
        `${interaction.user.tag} (${interaction.user.id})`,
        interaction.user.displayAvatarURL({ format: 'png', size: 64, dynamic: true })
      )
      .addField(
        '❯ Details',
        `• Action: Purge` + `\n• Amount: ${amount}` + `\n• Reason: ${reason ? `\`${reason.value}\`` : 'None specified'}`
      );

    (interaction.channel as TextChannel).bulkDelete(amount, true).then(
      messages => {
        sendToLogChannel(interaction.guild, logEmbed);
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
