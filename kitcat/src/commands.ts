import { Collection } from 'discord.js';
// Must be first command import or it becomes some sort of dependency loop
import { Command } from './commands/_Command';

import { Avatar } from './commands/avatar';
import { Ban } from './commands/ban';
import { CustomImg } from './commands/custom-img';
import { DashBoard } from './commands/dashboard';
import { EightBall } from './commands/8ball';
import { Help } from './commands/help';
import { Kick } from './commands/kick';
import { Meme } from './commands/meme';
import { NameMC } from './commands/namemc';
import { NHentai } from './commands/nhentai';
import { Pet } from './commands/pet';
import { Ping } from './commands/ping';
import { Purge } from './commands/purge';
import { PurgeChannel } from './commands/purgechannel';
import { ServerInfo } from './commands/serverinfo';
import { Status } from './commands/status';
import { Subreddit } from './commands/subreddit';
import { TTS } from './commands/tts';
import { Warn } from './commands/warn';
import { Eval } from './commands/eval';

export const commands: Collection<string, Command> = new Collection();

export function registerCommands() {
  const cmdsToRegister: Command[] = [
    new Avatar(),
    new Ban(),
    new CustomImg(),
    new DashBoard(),
    new EightBall(),
    new Help(),
    new Kick(),
    new Meme(),
    new NameMC(),
    new NHentai(),
    new Pet(),
    new Ping(),
    new Purge(),
    new PurgeChannel(),
    new ServerInfo(),
    new Status(),
    new Subreddit(),
    new TTS(),
    new Warn(),
    new Eval()
  ];
  cmdsToRegister.forEach(command => commands.set(command.executor, command));
}