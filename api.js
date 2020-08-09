const bodyParser = require('body-parser');
const fetch = require('node-fetch');
var db = require('./db.js').db;
var app = require('express')();
var server;
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
              db.get(
                'SELECT * FROM commands WHERE guild=?',
                [req.params.guildID],
                (err, result) => {
                  delete result.guild;

                  if (err) {
                    console.log(err.message);
                    return res.json({
                      status: 500,
                      message: 'An internal error occured.'
                    });
                  }

                  return res.json({
                    status: 0,
                    commands: result
                  });
                }
              );
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
      console.log(err.message);
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
        guild.members.fetch(json.id).then((member) => {
          if (member.hasPermission('ADMINISTRATOR')) {
            let validCommands = [
              '2048',
              '8ball',
              'avatar',
              'ban',
              'cat',
              'doggo',
              'image',
              'kick',
              'meme',
              'ping',
              'purge',
              'purgechannel',
              'quote',
              'roulette',
              'say',
              'sban',
              'skick',
              'soundboard',
              'subreddit',
              'trivia',
              'tts',
              'wolfram'
            ];
            let commandSQL = 'UPDATE commands SET ';
            let commandSQLParams = [];
            const commands = JSON.parse(req.headers.data).commands;
            Object.keys(commands).map((commandName) => {
              if (!validCommands.includes(commandName))
                return res.json({
                  status: 1,
                  message: `"${commandName}" is not a valid command!`
                });

              commandSQL += `'${commandName}' = ?, `;
              commandSQLParams.push(commands[commandName]);
            });
            commandSQL = commandSQL.slice(0, -2);
            commandSQL += ' WHERE guild = ?';
            commandSQLParams.push(guild.id);

            db.run(commandSQL, commandSQLParams, (err) => {
              if (err) {
                console.log(err.message);
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
              status: 2,
              message: error.message
            });
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
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
        let guilds = {};
        client.guilds.cache.each((guild) => {
          if (guild.members.cache.get(json.id)) {
            guilds[guild.id] = {
              name: guild.name,
              iconURL: guild.iconURL({ size: 256, dynamic: true, format: 'png' })
            };
          }
        });
        res.json({
          status: 0,
          guilds: guilds
        })
      }
    })
    .catch((err) => {
      console.log(err.message);
      res.json({
        status: 500,
        message: 'An error occured.'
      });
    });
});

module.exports = {
  startExpress(botClient) {
    client = botClient;
    server = app.listen(4000);
  }
};
