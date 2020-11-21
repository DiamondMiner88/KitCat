import { Router } from 'express';
import fetch from 'node-fetch';
import { db, toggleableCmds, addDefaultGuildSettings } from '../db';
import { getGuildSettings, guildSettingsCache } from '../cache';
import { bot } from '../bot';
import { getLogger } from 'log4js';
import { Guild, GuildMember } from 'discord.js';
import FormData from 'form-data';

const api = Router();
export default api;

const LOGGER = getLogger('api');

/**
 * Response will always be 200 OK, but the json might not tell the same story
 *
 * Response JSON format with everything ok: {status: 0}
 * With errors: {status: ERROR_CODE, message: 'English error message here', error: "raw error if it exists"}
 *
 * Codes:
 * 0 == Request executed successfully
 * 1 == Invalid request (ie. Missing data in the guild save url)
 * 2 == Invalid Authorization / Discord Error
 * 3 ==
 * 4 ==
 * 5 == Guild Error (ie. missing permissions, channel does not exist by the time)
 * 6 == Internal error
 */

api.post('/token', async (request, response) => {
    console.log('accessed');
    return response.json({
        hello: 'hello',
    });

    if (!request.body.code || !request.body['redirect_uri'])
        return response.json({
            code: 1,
            message: 'Invalid request!',
        });

    const data = new FormData();

    data.append('client_id', '744613719501176893');
    data.append('client_secret', '');
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', request.body['redirect_uri']);
    data.append('scope', 'identify');
    data.append('code', request.body.code);
    console.log(request.body);

    let res;
    try {
        res = await fetch('https://discordapp.com/api/oauth2/token', {
            method: 'POST',
            body: data,
        });
        res = await res.json();
    } catch (error) {
        LOGGER.error('Error sending request to discord.com to get access token. api-1.0.0 /token');
        LOGGER.error(error.message);
        return response.json({
            status: 6,
            message: 'Error sending request to get access token.',
            error: error,
        });
    }

    if (!res.access_token) {
        return response.json({
            status: 2,
            message: 'No access token present on response.',
            error: res,
        });
    }

    return response.json({
        status: 0,
        data: res,
    });
});

api.post('/guilds/:guild', async (request, response) => {
    if (!request.body['access-token'] || !Array.isArray(request.body.info))
        return response.json({
            code: 1,
            message: 'Invalid request!',
        });

    let discordRes;
    try {
        discordRes = await fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `Bearer ${request.body['access-token']}`,
            },
        });
        discordRes = await discordRes.json();
    } catch (error) {
        LOGGER.error('Error sending request to discord.com to verify access token. api-1.0.0 /guild/:guild');
        LOGGER.error(error.message);
        return response.json({
            status: 5,
            message: 'Error sending request to verify access token!',
            error: error,
        });
    }

    if (discordRes.message)
        return response.json({
            status: 2,
            message: discordRes.message === '401: Unauthorized' ? 'Invalid access token!' : discordRes.message,
            error: discordRes.message,
        });

    let guild: Guild;
    let member: GuildMember;
    try {
        guild = await bot.guilds.fetch(request.params.guild);
        if (!guild)
            return response.json({
                status: 5,
                message: 'The bot is not in that guild.',
            });

        member = await guild.members.fetch(discordRes.id);
    } catch (error) {
        return response.json({
            status: 5,
            message:
                error.message === 'Missing Access'
                    ? 'The bot is not in that server'
                    : error.message === 'Unknown Member'
                    ? 'You are not in that server'
                    : 'Check the error for more info',
            error: error,
        });
    }

    const responseBody: { status: number; data: any } = {
        status: 0,
        data: {},
    };

    request.body.info.forEach(async (infotype: any) => {
        switch (infotype) {
            case 'settings':
                responseBody.data.settings = getGuildSettings(guild);
                break;
            case 'channels':
                responseBody.data.channels = guild.channels.cache
                    .filter((channel) => channel.type !== 'category')
                    .map((channel) => {
                        return {
                            id: channel.id,
                            name: channel.name,
                        };
                    });
                break;
        }
    });

    return response.json(responseBody);
});

/**
 * Example URL: /guilds/123456788901234567/save
 * Headers:
 *  - access-token: Discord oauth access token (Required)
 *  - data: (Required)
 *    - commands
 *    - settings
 */
api.post('/guilds/:guild/save', async (request, response) => {
    if (!request.body['access-token'] || !request.body.data)
        return response.json({
            code: 1,
            message: 'Invalid request!',
        });

    if (Object.keys(request.body.data).length === 0)
        return response.json({
            status: 0,
        });

    let discordRes;
    try {
        discordRes = await fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `Bearer ${request.body['access-token']}`,
            },
        });
        discordRes = await discordRes.json();
    } catch (error) {
        LOGGER.error('Error sending request to discord.com to verify access token. api-1.0.0 /guild/:guild/save');
        LOGGER.error(error.message);
        return response.json({
            status: 5,
            message: 'Error sending request to verify access token!',
            error: error,
        });
    }

    if (discordRes.message)
        return response.json({
            status: 2,
            message: discordRes.message === '401: Unauthorized' ? 'Invalid access token!' : discordRes.message,
            error: discordRes.message,
        });

    let guild: Guild;
    let member: GuildMember;
    try {
        guild = await bot.guilds.fetch(request.params.guild);
        if (!guild)
            return response.json({
                status: 5,
                message: 'The bot is not in that guild.',
            });

        member = await guild.members.fetch(discordRes.id);
    } catch (error) {
        return response.json({
            status: 5,
            message:
                error.message === 'Missing Access'
                    ? 'The bot is not in that server'
                    : error.message === 'Unknown Member'
                    ? 'You are not in that server'
                    : 'Check the error for more info',
            error: error,
        });
    }

    if (!member.hasPermission('ADMINISTRATOR'))
        return response.json({
            status: 5,
            message: 'You do not have the Administrator permission on that server',
        });

    const { commands, prefix, dmTextEnabled, dmText, audit_channel } = request.body.data;

    if (commands && !(commands instanceof Object))
        return response.json({
            status: 1,
            message: 'Invalid Request!',
        });

    if (commands)
        for (const cmdName of Object.keys(commands)) {
            if (toggleableCmds[cmdName] === undefined)
                return response.json({
                    status: 1,
                    message: `'${cmdName}' is not a toggleable command!`,
                });
        }

    const guildSettings = getGuildSettings(guild);

    let sql = 'UPDATE settings SET';
    let sqlArgs = [];

    if (commands !== undefined) {
        sql += ' commands = ?,';
        sqlArgs.push(JSON.stringify({ ...guildSettings.commands, ...commands }));
    }
    if (prefix !== undefined) {
        sql += ' prefix = ?,';
        sqlArgs.push(prefix);
    }
    if (dmTextEnabled !== undefined) {
        sql += ' dmTextEnabled = ?,';
        sqlArgs.push(dmTextEnabled);
    }
    if (dmText !== undefined) {
        sql += ' dmText = ?,';
        sqlArgs.push(dmText);
    }
    if (audit_channel !== undefined) {
        sql += ' audit_channel = ?,';
        sqlArgs.push(audit_channel);
    }

    sql = sql.slice(0, -1);
    sql += ' WHERE guild = ?';
    sqlArgs.push(guild.id);

    try {
        db.prepare(sql).run(sqlArgs);
    } catch (error) {
        LOGGER.error('Error inserting new settings data API-1.0.0 /guilds/:guild/save');
        LOGGER.error(error);
        return response.json({
            status: 6,
            message: 'An SQL error occured.',
        });
    }
    guildSettingsCache.del(guild.id);
    return response.json({
        status: 0,
    });
});

api.post('/guilds', async (request, response) => {
    if (!request.body['access-token'])
        return response.json({
            code: 1,
            message: 'Invalid request!',
        });

    let discordRes;
    try {
        discordRes = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: {
                authorization: `Bearer ${request.body['access-token']}`,
            },
        });
        discordRes = await discordRes.json();
    } catch (error) {
        LOGGER.error('Error sending request to discord.com to verify access token/get guilds. api-1.0.0 /guilds');
        LOGGER.error(error.message);
        return response.json({
            status: 5,
            message: 'Error sending request to verify access token!',
            error: error,
        });
    }

    if (discordRes.message)
        return response.json({
            status: 2,
            message: discordRes.message === '401: Unauthorized' ? 'Invalid access token!' : discordRes.message,
            error: discordRes.message,
        });

    let guilds: {
        id: string;
        name: string;
        nameAcronym: string;
        iconURL: string;
        isAdmin: boolean;
    }[] = [];

    for (const guild of discordRes) {
        const fguild = bot.guilds.cache.get(guild.id);
        if (!fguild) continue;
        guilds.push({
            id: guild.id,
            name: guild.name,
            nameAcronym: fguild.nameAcronym,
            iconURL: fguild.iconURL({ size: 256, dynamic: true, format: 'png' }),
            isAdmin: (guild.permissions & 0x8) === 0x8, // Check if the user has the 'ADMINISTRATOR' permission
        });
    }

    response.json({
        status: 0,
        data: {
            guilds: guilds,
        },
    });
});
