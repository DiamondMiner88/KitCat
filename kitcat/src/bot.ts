// Clear the console
import clear from 'clear';
clear();

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
    path: path.join(__dirname, '../config'),
});

import Discord from 'discord.js';
import { toggleableCmds, db } from './db';
import { getGuildSettings, IGuildSettings } from './cache';
import { startAPI } from './api/api';
import cleanup from 'node-cleanup';
import * as selfroles from './commands/roles';

// Register commands
import { registerCommands, commands } from './commands';
registerCommands();

export const bot = new Discord.Client({ partials: ['REACTION', 'MESSAGE'] });
const LOGGER = log4js.getLogger('bot');

cleanup((code, signal) => {
    LOGGER.debug(`Exiting with code ${code} and signal ${signal}`);
    bot.destroy();
    db.close();
    log4js.shutdown();
});

bot.on('messageReactionAdd', selfroles.onMessageReactionAdd);
bot.on('messageReactionRemove', selfroles.onMessageReactionRemove);

bot.on('ready', () => {
    LOGGER.debug('Bot is ready');
    bot.user.setActivity(`Ping me for help | Serving ${bot.guilds.cache.size} servers`);

    if (argv.api !== false) startAPI();
});

bot.on('guildMemberAdd', (member) => {
    const { dmTextEnabled, dmText } = getGuildSettings(member.guild);
    if (dmTextEnabled === 1) member.user.send(dmText).catch(() => undefined);
});

bot.on('guildCreate', (_guild) => bot.user.setActivity(`Ping me for help | Serving ${bot.guilds.cache.size} servers`));

bot.on('guildDelete', (_guild) => bot.user.setActivity(`Ping me for help | Serving ${bot.guilds.cache.size} servers`));

bot.on('message', async (message) => {
    try {
        await message.fetch();
    } catch (error) {
        return;
    }

    if (message.author.bot) return;

    const settings: IGuildSettings = message.channel.type !== 'dm' ? getGuildSettings(message.guild) : { prefix: 'k!' };
    const { prefix } = settings;

    if (
        message.mentions.has(bot.user, { ignoreRoles: true, ignoreEveryone: true }) &&
        !message.toString().toLowerCase().includes(prefix.toLowerCase())
    )
        return message.channel.send(`Do ${prefix} help for commands!`);

    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    const command = commands.find((c) => c.executor === commandName || c.aliases?.includes(commandName));
    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text')
        return message.channel.send('This command only works in Guild Text Channels!');
    if (message.channel.type !== 'dm' && command.nsfw === true && !message.channel.nsfw)
        return message.channel.send('NSFW commands can only be run in NSFW channels');

    if (message.channel.type === 'dm') return command.run(message, args, settings);

    switch (settings.commands[commandName]) {
        case 1:
            return command.run(message, args, settings);
        case 0:
            return message.channel.send('This command has been disabled on this server.');
        case undefined:
            if (toggleableCmds[commandName] === undefined || toggleableCmds[commandName] === 1)
                command.run(message, args, settings);
            else message.channel.send('This command has been disabled on this server.');
            // if (toggleableCmds[commandName] !== undefined) {
            //     // add update db to enable command to
            // }
    }
});

bot.login(process.env.BOT_TOKEN);
