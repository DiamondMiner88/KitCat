// Clear the console
import clear from 'clear';
clear();

// Logging
import { initLogger } from './util/logging';
import log4js from 'log4js';
initLogger();
const LOGGER = log4js.getLogger('bot');

// Enviromenmt variables & command line arguments
import yargs from 'yargs';
import path from 'path';
import { config as dotenvconfig } from 'dotenv-flow';
export const argv = yargs.choices('enviroment', ['development', 'production']).option('no-api', { description: 'Start bot without api', type: 'boolean' }).argv;
dotenvconfig({
    node_env: argv.enviroment || 'development',
    path: path.join(__dirname, '../config'),
});

import Discord from 'discord.js';
import { toggleableCmds, db } from './db';
import { getGuildSettings, guildSettingsCache, IGuildSettings } from './settings';
import { startAPI } from './api/express';
import cleanup from 'node-cleanup';
import { Command } from './commands';
import * as reactionroles from './commands/reactionroles';

export const bot = new Discord.Client({ partials: ['REACTION', 'MESSAGE'] });
// @ts-expect-error Types are not added yet in this discord.js PR
const interactionClient = bot.interactionClient;

export const commands: Command[] = [];
import glob from 'glob';
import { NOOP } from './util/utils';
glob(`${__dirname}/commands/*.js`, (err, matches) => {
    if (err) LOGGER.error(err);
    matches.forEach(async file => {
        const command = (await import(file)) as any;
        commands.push(new command.default());
    });
});

cleanup(() => {
    LOGGER.debug(`Exiting...`);
    bot.destroy();
    db.close();
    log4js.shutdown();
});

bot.on('messageReactionAdd', reactionroles.onMessageReactionAdd);
bot.on('messageReactionRemove', reactionroles.onMessageReactionRemove);

bot.on('ready', () => {
    LOGGER.debug('Bot is ready');
    bot.user!.setActivity(`Ping me for help | Serving ${bot.guilds.cache.size} servers`);
    if (argv.api !== false) startAPI();
});

bot.on('guildMemberAdd', member => {
    const { dmTextEnabled, dmText } = getGuildSettings(member.guild);
    if (dmTextEnabled === 1 && dmText) member.user.send(dmText).catch(NOOP);
});

bot.on('guildCreate', () => bot.user!.setActivity(`@KitCat | Serving ${bot.guilds.cache.size} servers`));
bot.on('guildDelete', () => bot.user!.setActivity(`@KitCat | Serving ${bot.guilds.cache.size} servers`));

bot.on('messageDelete', reactionroles.onMessageDelete);

bot.on('message', async message => {
    try {
        await message.fetch();
        if (message.author.bot) return;
    } catch (error) {
        return;
    }

    const settings: IGuildSettings = message.channel.type !== 'dm' ? getGuildSettings(message.guild!) : { prefix: 'k!' };
    const { prefix } = settings;

    if (message.mentions.has(bot.user!, { ignoreRoles: true, ignoreEveryone: true }) && !message.toString().toLowerCase().includes(prefix.toLowerCase()))
        return message.channel.send(`Do ${prefix}help for commands!`);

    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift()!.toLowerCase();

    const command = commands.find(c => c.trigger === commandName);
    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') return message.channel.send('This command only works in Guild Text Channels!');
    if (message.channel.type !== 'dm' && command.nsfw === true && !message.channel.nsfw) return message.channel.send('NSFW commands can only be run in NSFW channels');

    if (message.channel.type === 'dm') return command.invoke(message, args, settings);

    switch (settings.commands![commandName]) {
        case 1:
            return command.invoke(message, args, settings);
        case 0:
            return message.channel.send('This command has been disabled on this server.');
        case undefined:
            if (toggleableCmds[commandName] === undefined || toggleableCmds[commandName] === 1) command.invoke(message, args, settings);
            else message.channel.send('This command has been disabled on this server.');
            if (toggleableCmds[commandName] !== undefined) {
                const newCommandData = JSON.stringify({ ...{ [commandName]: 1 }, ...settings.commands });
                db.prepare('UPDATE settings SET commands = ? WHERE guild = ?').run(newCommandData, message.guild!.id);
                guildSettingsCache.del(message.guild!.id);
            }
    }
});

bot.login();
