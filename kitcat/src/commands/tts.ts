import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './_Command';

export class TTS extends Command {
  constructor() {
    super();
    this.executor = 'tts';
    this.category = 'util';
    this.displayName = `🤖 Text-To-Speech`;
    this.description = `Joins your VC and says what you want it to say!`;
    this.usage = '{Text}';
    this.guildOnly = true;
    this.unlisted = false;
    this.nsfw = false;
  }

  async run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    if (!message.member.voice.channel)
      return message.channel.send('You are not in a voice channel!');
    if (!message.member.roles.cache.some((role) => role.name === 'DJ'))
      return message.channel.send('You do not have the DJ role!');

    const text = args.join(' ');

    // if (text.length > 200) return message.channel.send('Text exceeds 200 character limit.');
    const channel = message.member.voice.channel;
    const connection = await message.member.voice.channel.join();
    var url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text
    )}&tl=en&client=tw-ob`;
    const dispatcher = connection.play(url);
    dispatcher.on('finish', () => {
      channel.leave();
    });
  }
}
