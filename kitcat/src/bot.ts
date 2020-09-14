// Logging
import { initLogger } from './util/logging';
import log4js from 'log4js';
initLogger();

// Setup Enviromenmt variables
import path from 'path';
import { config as dotenvconfig } from 'dotenv-flow';
dotenvconfig({
  node_env: process.argv[2] || 'development',
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
  bot.user.setActivity(`Ping me for help | Serving ${bot.guilds.cache.array().length} servers`);
  startAPI();
});

bot.on('guildMemberAdd', (member) => {
  const { dmTextEnabled, dmText } = getGuildSettings(member.guild);
  if (dmTextEnabled === 1) member.user.send(dmText).catch(() => {});
});

bot.on('messageReactionAdd', (messageReaction, user) => {
  require('./commands/2048.js').onReactionAdded(messageReaction, user);
});

bot.on('message', (message) => {
  if (message.author.bot) return;

  const settings: IGuildSettings | undefined =
    message.channel.type !== 'dm' ? getGuildSettings(message.guild) : null;
  const prefix = settings ? settings.prefix : 'k!';

  if (message.mentions.has(bot.user)) return message.channel.send(`Do ${prefix}help for commands!`);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();
  if (message.content.indexOf(prefix) !== 0) return;

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
      // @ts-ignore // FIX THIS LATER I HAVE NO IDEA HOW TO FIX LMAO
      const commandEnabled = settings.commands[commandName];
      switch (commandEnabled) {
        case 1:
          command.run(message, args, settings);
          break;
        case 0:
          message.channel.send('This command has been disabled on this server.');
          break;
        case undefined:
          // @ts-ignore same as above comment
          if (toggleableCmds[commandName] === undefined || toggleableCmds[commandName] === 1)
            command.run(message, args, settings);
          else message.channel.send('This command has been disabled on this server.');
          // @ts-ignore same as above comment
          if (toggleableCmds[commandName] !== undefined) {
            // add update db to enable command
          }
      }
    }
  }
});

bot.login(process.env.BOT_TOKEN);
