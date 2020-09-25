// Logging
import { initLogger } from './util/logging';
import log4js from 'log4js';
initLogger();

// Setup Enviromenmt variables/Command line arguments
import yargs from 'yargs';
import path from 'path';
import { config as dotenvconfig } from 'dotenv-flow';
export const argv = yargs
  .choices('enviroment', ['development', 'production'])
  .option('no-api', { description: 'Start bot without api', type: 'boolean' }).argv;
dotenvconfig({
  node_env: argv.enviroment || 'development',
  path: path.join(__dirname, '../config')
});

import Discord from 'discord.js';
import { toggleableCmds, db } from './db';
import { getGuildSettings, IGuildSettings } from './cache';
import { startAPI } from './api/api';
import cleanup from 'node-cleanup';

// Register commands
import { registerCommands, commands } from './commands';
registerCommands();

export const bot = new Discord.Client();
const LOGGER = log4js.getLogger('bot');

cleanup((code, signal) => {
  LOGGER.debug(`Exiting with code ${code} and signal ${signal}`);
  bot.destroy();
  db.close();
  log4js.shutdown();
});

bot.on('ready', () => {
  LOGGER.debug('Bot is ready');
  bot.user.setActivity(`Ping me for help | Serving ${bot.guilds.cache.size} servers`);
  if (argv.api) startAPI();
});

bot.on('guildMemberAdd', member => {
  const { dmTextEnabled, dmText } = getGuildSettings(member.guild);
  if (dmTextEnabled === 1) member.user.send(dmText).catch(() => {});
});

bot.on('guildCreate', guild =>
  bot.user.setActivity(`Ping me for help | Serving ${bot.guilds.cache.size} servers`)
);

bot.on('guildDelete', guild =>
  bot.user.setActivity(`Ping me for help | Serving ${bot.guilds.cache.size} servers`)
);

bot.on('message', message => {
  if (message.author.bot) return;

  if (
    (message.content.includes('gay') || message.content.includes('gae')) &&
    message.guild.id === '752212085672247296'
  ) {
    message.delete().catch(() => {});
    message.author
      .send("Your message was deleted because 'gay' is forbidden on this server.")
      .catch(() => {});
    return;
  }

  const settings: IGuildSettings =
    message.channel.type !== 'dm' ? getGuildSettings(message.guild) : { prefix: 'k!' };
  const { prefix } = settings;

  if (message.mentions.has(bot.user, { ignoreRoles: true, ignoreEveryone: true }))
    return message.channel.send(`Do ${prefix}help for commands!`);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();
  if (message.content.toLowerCase().indexOf(prefix.toLowerCase()) !== 0) return;

  const command = commands.get(commandName);
  if (!command) return;
  if (command.guildOnly && message.channel.type !== 'text')
    message.channel.send('This command only works in Guild Text Channels!');
  else if (message.channel.type !== 'dm' && command.nsfw === true && !message.channel.nsfw)
    message.channel.send(
      "This is a NSFW command. Per Discord's policy, these can only be executed in NSFW channels."
    );
  else if (command.executor === commandName) {
    if (message.channel.type === 'dm') command.run(message, args, settings);
    else {
      switch (settings.commands[commandName]) {
        case 1:
          return command.run(message, args, settings);
        case 0:
          return message.channel.send('This command has been disabled on this server.');
        case undefined:
          if (toggleableCmds[commandName] === undefined || toggleableCmds[commandName] === 1)
            command.run(message, args, settings);
          else message.channel.send('This command has been disabled on this server.');
          if (toggleableCmds[commandName] !== undefined) {
            // add update db to enable command to
          }
      }
    }
  }
});

bot.login(process.env.BOT_TOKEN);
