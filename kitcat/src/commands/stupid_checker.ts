import { Message } from "discord.js";

const stupid_words = ['owo', 'uwu', 'daddy', 'hentai', 'fuck me']

export function is_bad(message: Message) {
  if (message.member.hasPermission('KICK_MEMBERS')) return;
  var stupid: string[] = [];
  stupid_words.forEach((item: string) => {
    if (message.content.toLowerCase().includes(item)) {
      stupid.push("**" + item + "**");
    }
  });
  if (stupid.length != 0) {
    message.delete();
    stupid[stupid.length - 1] = 'and ' + stupid[stupid.length - 1];
    return message.channel.send(`Your message contained cancer ${message.author}. It contained ${stupid.join(', ')}.\nYou said: ||${message.content}||`);
  }
}
