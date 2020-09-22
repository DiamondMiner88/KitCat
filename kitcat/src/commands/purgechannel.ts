import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './_Command';

export class PurgeChannel extends Command {
  constructor() {
    super();
    this.executor = 'purgechannel';
    this.category = 'moderation';
    this.display_name = `🗑️ Purge Channel`;
    this.description = `Used to delete to wipe all messages in a channel. ***This command deletes and makes a new channel. Pins will be gone***`;
    this.usage = '';
    this.guildOnly = true;
    this.unlisted = false;
    this.nsfw = false;
  }

  async run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    if (message.channel.type === 'dm') return; // Avoid TS errors

    if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.channel.send('You do not have the permission to manage messages.');
    if (!message.channel.deletable)
      return message.channel.send("I don't have permission to delete this channel!");

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
      .catch(err => {
        message.channel.send('Error deleting this channel!\n' + err.message);
      });
  }
}
