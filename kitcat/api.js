const Discord = require('discord.js');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
var { db, acceptableCmds, addGuildToSettings } = require('./db.js');

var app = require('express')();

/**
 * @type {Discord.Client}
 */
var client;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

/**
 * Response will always have a status code of 200, but the json might not tell the same story
 *
 * Response JSON format with everything ok: {status: 0}
 * With errors: {status: ERROR_CODE, message: 'English error message here'}
 *
 * OK codes:
 * 0 == Request executed successfully
 *
 * Error codes:
 * 1   == Invalid request data
 * 400 == Invalid request (ie. Missing data in the guild save url)
 * 401 == Invalid Discord access token
 * 2   == Discord Error
 * 403 == Missing permissions
 * 500 == Internal error (ie. SQL error. In this case provide the sql error as the message)
 */

/**
 * Example URL: /guild/123456788901234567
 * Headers:
 *  - access-token: Discord oauth access token (Required)
 */
app.get('/guild/:guildID', (req, res) => {
  if (!req.headers['access-token'])
    return res.json({
      code: 400,
      message: 'Missing request headers!'
    });

  fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `Bearer ${req.headers['access-token']}`
    }
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.message)
        res.json({
          status: 401,
          message: json.message
        });
      else {
        const guild = client.guilds.resolve(req.params.guildID);

        if (guild === null)
          return res.json({
            status: 2,
            message: 'The bot is not in the guild you requested.'
          });

        guild.members
          .fetch(json.id)
          .then((member) => {
            if (member.hasPermission('ADMINISTRATOR')) {
              addGuildToSettings(guild.id).then(() => {
                db.get(
                  'SELECT * FROM settings WHERE guild=?',
                  [req.params.guildID],
                  (err, result) => {
                    if (err) {
                      console.error(err.message);
                      return res.json({
                        status: 500,
                        message: 'An internal error occured.'
                      });
                    }

                    return res.json({
                      status: 0,
                      prefix: result.prefix,
                      commands: JSON.parse(result.commands),
                      dmTextEnabled: result.dmTextEnabled,
                      dmText: result.dmText
                    });
                  }
                );
              });
            } else
              return res.json({
                status: 403,
                message: 'Missing permissions.'
              });
          })
          .catch((error) => {
            const message = error.message;
            if (message === 'Unknown Member')
              return res.json({
                status: 403,
                message: 'You are not in the guild you requested.'
              });
            else
              return res.json({
                status: 2,
                message: error.message
              });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.json({
        status: 500,
        message: 'An error occured.'
      });
    });
});

/**
 * Example URL: /guild/123456788901234567/save
 * Headers:
 *  - access-token: Discord oauth access token (Required)
 *  - data: (Required)
 *    - commands
 *    - settings
 */
app.get('/guild/:guildID/save', (req, res) => {
  if (!req.headers['access-token'] || !req.headers.settings)
    return res.json({
      code: 400,
      message: 'Missing request headers!'
    });

  fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `Bearer ${req.headers['access-token']}`
    }
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.message)
        res.json({
          status: 401,
          message: json.message
        });
      else {
        const guild = client.guilds.resolve(req.params.guildID);
        if (guild === null)
          return res.json({
            status: 2,
            message: 'The bot is not in the guild you requested.'
          });
        guild.members
          .fetch(json.id)
          .then((member) => {
            if (member.hasPermission('ADMINISTRATOR')) {
              const { commands, prefix, dmTextEnabled, dmText } = JSON.parse(req.headers.settings);
              Object.keys(commands).map((commandName) => {
                // Dont transform === undefined into !
                if (acceptableCmds[commandName] === undefined)
                  return res.json({
                    status: 1,
                    message: `"${commandName}" is not a valid command!`
                  });
              });

              const sql =
                'UPDATE settings SET commands = ?, prefix = ?, dmTextEnabled = ?, dmText = ?';
              db.run(sql, [JSON.stringify(commands), prefix, dmTextEnabled, dmText], (err) => {
                if (err) {
                  console.error(err);
                  return res.json({
                    status: 500,
                    message: 'An internal error occured.'
                  });
                }
                return res.json({
                  status: 0
                });
              });
            } else
              return res.json({
                status: 403,
                message: 'Missing permissions.'
              });
          })
          .catch((error) => {
            if (error.message === 'Unknown Member')
              return res.json({
                status: 403,
                message: 'You are not in the guild you requested.'
              });
            else
              return res.json({
                status: 500,
                message: error.message
              });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.json({
        status: 500,
        message: 'An error occured.'
      });
    });
});

app.get('/guilds', (req, res) => {
  if (!req.headers['access-token'])
    return res.json({
      code: 400,
      message: 'Missing request headers!'
    });

  fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      authorization: `Bearer ${req.headers['access-token']}`
    }
  })
    .then((res) => res.json())
    .then(async (json) => {
      if (json.message)
        res.json({
          status: 401,
          message: json.message
        });
      else {
        let guilds = [];

        for (const guild of json) {
          // Check if the user has the 'ADMINISTRATOR' permission
          if ((guild.permissions & 0x8) !== 0x8) continue;

          const fguild = await client.guilds.fetch(guild.id).catch(() => {});
          if (!fguild) continue;

          guilds.push({
            id: guild.id,
            name: guild.name,
            nameAcronym: fguild.nameAcronym,
            iconURL: fguild.iconURL({ size: 256, dynamic: true, format: 'png' })
          });
        }
        res.json({
          status: 0,
          guilds: guilds
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.json({
        status: 500,
        message: 'An error occured.'
      });
    });
});

module.exports = {
  startExpress(botClient) {
    client = botClient;
    app.listen(4000);
  }
};
