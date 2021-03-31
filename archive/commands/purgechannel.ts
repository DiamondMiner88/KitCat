import Discord, { TextChannel, Permissions } from 'discord.js';
import { Command, Categories } from '../commands';
import { hasPermission } from '../utils';

export default class extends Command {
  trigger = 'purgechannel';
  category = Categories.MODERATION;
  name = `🗑️ Purge Channel`;
  description = `Used to delete to wipe all messages in a channel. Sometimes is buggy. **This command deletes and makes a new channel.**`;
  usage = '';
  guildOnly = true;
  unlisted = false;
  nsfw = false;

  async invoke(message: Discord.Message): Promise<any> {
    message.channel = message.channel as TextChannel;

    if (!hasPermission(message.member!, Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send('You do not have to do that!');
    if (!message.channel.deletable) return message.channel.send(`I don't have permission to delete this channel!`);

    const { rawPosition } = message.channel;

    let newChnl: Discord.TextChannel | Discord.NewsChannel;
    try {
      newChnl = await message.channel.clone();
    } catch (error) {
      message.channel.send('Error cloning this channel!\n' + error);
    }

    message.channel
      .delete()
      .then(() => {
        newChnl.setPosition(rawPosition);
      })
      .catch(err => message.channel.send('Error deleting this channel!\n' + err.message));
  }
}
