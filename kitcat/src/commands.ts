import { Collection } from 'discord.js';

// Must be first command import or it becomes some sort of dependency loop
import { Command } from './commands/CommandBase';

import { Ban } from './commands/ban';
import { CustomImg } from './commands/custom-img';
import { DashBoard } from './commands/dashboard';
import { EightBall } from './commands/8ball';
import { Eval } from './commands/eval';
import { Help } from './commands/help';
import { Hug } from './commands/hug';
import { Joke } from './commands/joke';
import { Kick } from './commands/kick';
import { Meme } from './commands/meme';
import { NameMC } from './commands/namemc';
import { Pet } from './commands/pet';
import { Pfp } from './commands/avatar';
import { Ping } from './commands/ping';
import { Purge } from './commands/purge';
import { PurgeChannel } from './commands/purgechannel';
import { Roles } from './commands/roles';
import { ServerInfo } from './commands/serverinfo';
import { Status } from './commands/status';
import { Subreddit } from './commands/subreddit';
import { TTS } from './commands/tts';
import { TwoThousandFortyEight } from './commands/2048';
import { Warn } from './commands/warn';
import { Wolfram } from './commands/wolfram';

export const commands: Collection<string, Command> = new Collection();

export function registerCommands() {
    const cmdsToRegister: Command[] = [
        new Ban(),
        new CustomImg(),
        new DashBoard(),
        new EightBall(),
        new Eval(),
        new Help(),
        new Hug(),
        new Joke(),
        new Kick(),
        new Meme(),
        new NameMC(),
        new Pet(),
        new Pfp(),
        new Ping(),
        new Purge(),
        new PurgeChannel(),
        new Roles(),
        new ServerInfo(),
        new Status(),
        new Subreddit(),
        new TTS(),
        new TwoThousandFortyEight(),
        new Warn(),
        // @ts-expect-error
        new Wolfram()
    ];
    cmdsToRegister.forEach((command) => commands.set(command.executor, command));
}
