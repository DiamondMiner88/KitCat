import { Client, ClientOptions } from 'discord.js';
import { Command } from './commands';
import glob from 'glob';
import { logger } from './util/logging';

export class KClient extends Client {
  commands: Command[];

  constructor(options: ClientOptions = {}) {
    super(options);

    this.commands = [];
    glob(`${__dirname}/commands/*.js`, (err, matches) => {
      if (err) logger.error(`Error trying to get a list of available commands: ${err?.message}`);
      matches.forEach(async file => this.commands.push(new (await import(file)).default()));
    });
  }
}
