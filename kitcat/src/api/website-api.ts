import { Router } from 'express';
import fetch from 'node-fetch';
import { db, toggleableCmds } from '../db';
import { getGuildSettings, guildSettingsCache } from '../settings';
import { bot } from '../bot';
import { getLogger } from 'log4js';
import { Guild, GuildMember } from 'discord.js';
import FormData from 'form-data';

const api = Router();
export default api;

const LOGGER = getLogger('website-api');

/**
 * Response status code will always be 200, but the json might not tell the same story
 *
 * Examples responses:
 * OK: { status: 0 }
 * Error: { status: [error code], message: 'English error message here', error: [raw error if exists] }
 *
 * Codes:
 * 0 = Request executed successfully
 * 1 = Invalid request (ie. Missing data in the guild save url)
 * 2 = Invalid Authorization
 * 3 = Discord Error
 * 4 = Guild Error (ie. missing permissions, channel does not exist by the time)
 * 5 = Internal error
 */

api.post('/token', async (request, response) => {
    if (!request.body.code || !request.body.redirect_uri)
        return response.json({
            code: 1,
            message: 'Invalid request!',
        });

    const data = new FormData();
    data.append('client_id', process.env.KITCAT_APP_CLIENT);
    data.append('client_secret', process.env.KITCAT_APP_SECERT);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', request.body.redirect_uri);
    data.append('scope', 'identify');
    data.append('code', request.body.code);

    let res: any;
    try {
        res = await fetch('https://discordapp.com/api/oauth2/token', {
            method: 'POST',
            body: data,
        });
        res = await res.json();
    } catch (error) {
        LOGGER.error('Error sending request to discord.com to get access token.');
        LOGGER.error(error);
        return response.json({
            status: 3,
            message: 'Error authorizing.',
        });
    }

    if (!res.access_token) {
        return response.json({
            status: 3,
            message: 'No access token present on response.',
            error: res,
        });
    }

    return response.json({
        status: 0,
        data: res,
    });
});

api.post('/servers/:guild', async (request, response) => {
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
        LOGGER.error('Error sending request to discord.com to verify access token.');
        LOGGER.error(error.message);
        return response.json({
            status: 5,
            message: 'Error authorizing.',
            error,
        });
    }

    if (discordRes.message)
        return response.json({
            status: 2,
            message: discordRes.message === '401: Unauthorized' ? 'Invalid access token.' : discordRes.message,
            error: discordRes.message,
        });

    let guild: Guild;
    try {
        guild = await bot.guilds.fetch(request.params.guild);
        if (!guild)
            return response.json({
                status: 4,
                message: 'KitCat does not have access to that server.',
            });

        await guild.members.fetch(discordRes.id);
    } catch (error) {
        return response.json({
            status: 5,
            message:
                error.message === 'Missing Access'
                    ? 'The bot is not in that server'
                    : error.message === 'Unknown Member'
                    ? 'You are not in that server'
                    : 'Check the error for more info',
            error,
        });
    }

    const resdata: { status: number; data: any } = {
        status: 0,
        data: {},
    };

    request.body.info.forEach(async (infotype: any) => {
        switch (infotype) {
            case 'settings':
                resdata.data.settings = getGuildSettings(guild);
                break;
            case 'channels':
                resdata.data.channels = guild.channels.cache
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

    return response.json(resdata);
});

/**
 * Example URL: /severs/123456788901234567/save
 */
api.post('/servers/:guild/save', async (request, response) => {
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
            status: 3,
            message: 'Error authorizing.',
            error,
        });
    }

    if (discordRes.message)
        return response.json({
            status: 2,
            message: discordRes.message === '401: Unauthorized' ? 'Invalid access token.' : discordRes.message,
            error: discordRes,
        });

    let guild: Guild;
    let member: GuildMember;
    try {
        guild = await bot.guilds.fetch(request.params.guild);
        if (!guild)
            return response.json({
                status: 4,
                message: 'KitCat does not have access to that server.',
            });

        member = await guild.members.fetch(discordRes.id);
    } catch (error) {
        return response.json({
            status: 4,
            message:
                error.message === 'Missing Access'
                    ? 'The bot is not in that server'
                    : error.message === 'Unknown Member'
                    ? 'You are not in that server'
                    : 'Check the error for more info',
            error,
        });
    }

    if (!member.hasPermission('ADMINISTRATOR'))
        return response.json({
            status: 4,
            message: 'You do not have the Administrator permission in that server.',
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
    const sqlArgs = [];

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
        LOGGER.error('Error updating server settings.');
        LOGGER.error(error);
        return response.json({
            status: 5,
            message: 'An SQL error occured.',
        });
    }
    guildSettingsCache.del(guild.id);
    return response.json({
        status: 0,
    });
});

api.post('/severs', async (request, response) => {
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
        LOGGER.error('Error sending request to discord.com to verify access token/get guilds.');
        LOGGER.error(error.message);
        return response.json({
            status: 3,
            message: 'Error authorizing.',
            error,
        });
    }

    if (discordRes.message)
        return response.json({
            status: 2,
            message: discordRes.message === '401: Unauthorized' ? 'Invalid access token!' : discordRes.message,
            error: discordRes.message,
        });

    const guilds: {
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
