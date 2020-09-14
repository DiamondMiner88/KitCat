import { Router } from 'express';
import fetch from 'node-fetch';
import { db, toggleableCmds } from '../db';
import { getGuildSettings, guildSettingsCache } from '../cache';
import { bot } from '../bot';
import { getLogger } from 'log4js';
import { Guild, GuildMember } from 'discord.js';

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

api.post('/guilds/:guild', async (request, response) => {
  if (!request.body['access-token'] || !Array.isArray(request.body.info))
    return response.json({
      code: 1,
      message: 'Invalid request!'
    });

  let discordRes;
  try {
    discordRes = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `Bearer ${request.body['access-token']}`
      }
    });
    discordRes = await discordRes.json();
  } catch (error) {
    LOGGER.error(
      'Error sending request to discord.com to verify access token. api-1.0.0 /guild/:guild'
    );
    LOGGER.error(error.message);
    return response.json({
      status: 5,
      message: 'Error sending request to verify access token!',
      error: error
    });
  }

  if (discordRes.message)
    return response.json({
      status: 2,
      message:
        discordRes.message === '401: Unauthorized' ? 'Invalid access token!' : discordRes.message,
      error: discordRes.message
    });

  let guild: Guild;
  let member: GuildMember;
  try {
    guild = await bot.guilds.fetch(request.params.guild);
    if (!guild)
      return response.json({
        status: 5,
        message: 'The bot is not in that guild.'
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
      error: error
    });
  }

  const responseBody: { status: number; data: any } = {
    status: 0,
    data: {}
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
              name: channel.name
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
// api.get('/guilds/:guildID/save', (req, res) => {
//   if (!req.headers['access-token'] || !req.headers.settings)
//     return res.json({
//       code: 400,
//       message: 'Missing request headers!'
//     });

//   fetch('https://discord.com/api/users/@me', {
//     headers: {
//       authorization: `Bearer ${req.headers['access-token']}`
//     }
//   })
//     .then((res) => res.json())
//     .then((json) => {
//       if (json.message)
//         res.json({
//           status: 401,
//           message: json.message
//         });
//       else {
//         const guild = bot.guilds.resolve(req.params.guildID);
//         if (guild === null)
//           return res.json({
//             status: 2,
//             message: 'The bot is not in the guild you requested.'
//           });
//         guild.members
//           .fetch(json.id)
//           .then((member) => {
//             if (member.hasPermission('ADMINISTRATOR')) {
//               const { commands, prefix, dmTextEnabled, dmText } = JSON.parse(req.headers.settings);
//               Object.keys(commands).map((commandName) => {
//                 // @ts-ignore
//                 if (toggleableCmds[commandName] === undefined)
//                   return res.json({
//                     status: 1,
//                     message: `"${commandName}" is not a valid command!`
//                   });
//               });

//               try {
//                 db.prepare(
//                   'UPDATE settings SET commands = ?, prefix = ?, dmTextEnabled = ?, dmText = ?'
//                 ).run(JSON.stringify(commands), prefix, dmTextEnabled, dmText);
//               } catch (err) {
//                 console.error(err);
//                 return res.json({
//                   status: 500,
//                   message: 'An internal error occured.'
//                 });
//               }
//               guildSettingsCache.del(guild.id);
//               return res.json({
//                 status: 0
//               });
//             } else
//               return res.json({
//                 status: 403,
//                 message: 'Missing permissions.'
//               });
//           })
//           .catch((error) => {
//             if (error.message === 'Unknown Member')
//               return res.json({
//                 status: 403,
//                 message: 'You are not in the guild you requested.'
//               });
//             else
//               return res.json({
//                 status: 500,
//                 message: error.message
//               });
//           });
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.json({
//         status: 500,
//         message: 'An error occured.'
//       });
//     });
// });

api.post('/guilds', (request, response) => {
  if (!request.headers['access-token'])
    return response.json({
      code: 400,
      message: 'Missing request headers!'
    });

  fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      authorization: `Bearer ${request.headers['access-token']}`
    }
  })
    .then((res) => res.json())
    .then(async (json) => {
      if (json.message)
        response.json({
          status: 401,
          message: json.message
        });
      else {
        let guilds = [];

        for (const guild of json) {
          // Check if the user has the 'ADMINISTRATOR' permission
          if ((guild.permissions & 0x8) !== 0x8) continue;

          const fguild = await bot.guilds.fetch(guild.id).catch(() => {});
          if (!fguild) continue;

          guilds.push({
            id: guild.id,
            name: guild.name,
            nameAcronym: fguild.nameAcronym,
            iconURL: fguild.iconURL({ size: 256, dynamic: true, format: 'png' })
          });
        }
        response.json({
          status: 0,
          guilds: guilds
        });
      }
    })
    .catch((err) => {
      console.error(err);
      response.json({
        status: 500,
        message: 'An error occured.'
      });
    });
});
