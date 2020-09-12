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

// Register commands
import { registerCommands, commands } from './commands';
registerCommands();

const bot = new Discord.Client();

// // i have no idea how this works
// process.stdin.resume();
// function exitHandler(options: any, exitCode: number | undefined) {
//   if (exitCode || exitCode === 0) console.log(exitCode);
//   if (options.exit) {
//     console.log(`Stopping Bot and API...`);
//     db.close();
//     bot.destroy();
//     process.exit();
//   }
// }
// //do something when app is closing
// process.on('exit', exitHandler.bind(null, { cleanup: true }));
// //catches ctrl+c event
// process.on('SIGINT', exitHandler.bind(null, { exit: true }));
// // catches "kill pid" (for example: nodemon restart)
// process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
// process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
// //catches uncaught exceptions
// process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

bot.on('ready', () => {
  console.log(`Bot is ready.`);
  bot.user.setActivity(`Ping me for help | Serving ${bot.guilds.cache.array().length} servers`);
  // require('./api.js').startExpress(bot);
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

  // if (/\{\d{1,6}\}/.test(message.content)) {
  //   if (message.channel.type === 'dm') return require('./commands/nhentai.js').multiMatch(message);
  //   const nhEnabled = settings.commands.nhentai;
  //   if (nhEnabled === 1) return require('./commands/nhentai.js').multiMatch(message);
  //   else if (nhEnabled === 0)
  //     return message.channel.send('This command has been disabled on this server.');
  // }

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
