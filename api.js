var bodyParser = require('body-parser');
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

app.get('/guild/:guildID', (req, res) => {
  if (!req.headers['access-token']) {
    res.status(400).json({
      message: 'Missing authentication.'
    });
    return;
  }

  fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `Bearer ${req.headers['access-token']}`
    }
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.message) res.status(401).json(json);
      else {
        const guild = client.guilds.resolve(req.params.guildID);
        if (guild === null) {
          res.status(403).json({
            message: 'The bot is not in the guild you requested.'
          });
          return;
        }

        guild.members
          .fetch(json.id)
          .then((member) => {
            if (member.hasPermission('ADMINISTRATOR')) {
              db.get(
                'SELECT * FROM commands WHERE guild=?',
                [req.params.guildID],
                (err, result) => {
                  delete result.guild;
                  if (err)
                    res.status(500).json({
                      message: 'An internal error occured. Please try again later.'
                    });
                  else {
                    res.status(200).json({
                      commands: result
                    });
                  }
                }
              );
            } else
              res.status(403).json({
                message: "You don't have permission to manage this guild's settings!"
              });
          })
          .catch((error) => {
            const message = error.message;
            if (message === 'Unknown Member')
              res.status(403).json({
                message: 'You are not in the guild you requested.'
              });
            else
              res.status(500).json({
                message: 'An error occured. Please try again later.'
              });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'An error occured. Please try again later.'
      });
      console.log(err.message);
    });
});

// app.get('/guild/:guildID/save', (req, res) => {
//   if (!req.headers['token-type'] && !req.headers['access-token']) {
//     res.status(400).json({
//       message: 'Missing authentication.'
//     });
//     return;
//   }

//   fetch('https://discord.com/api/users/@me', {
//     headers: {
//       authorization: `${req.headers['token-type']} ${req.headers['access-token']}`
//     }
//   })
//     .then((res) => res.json())
//     .then((json) => {
//       if (json.message) res.status(401).json(json);
//       else {
//         const guild = client.guilds.resolve(req.params.guildID);
//         if (guild === null) {
//           res.status(403).json({
//             message: 'The bot is not in the guild you requested.'
//           });
//           return;
//         }

//         guild.members
//           .fetch(json.id)
//           .then((member) => {
//             if (member.hasPermission('ADMINISTRATOR')) {
//               let sql = 'UPDATE commands SET ';
//               let sqlParams = [];
//               console.log(req.headers.data);
//               for (const key in req.headers.data.commands) {
//                 if (!object.hasOwnProperty(key)) continue;
//                 sql += '? = ?, ';
//                 sqlParams.push(key, req.headers.data.commands[key]);
//               }
//               sql = sql.slice(0, -2) += ' WHERE guild=?';
//               console.log(sql);
//               console.log(sqlParams);
//               db.run(sql, sqlParams, (err) => {
//                 if (err) {
//                   console.log(err.message);
//                   res.status(500).json({
//                     message: 'An internal error occured. Please try again later.'
//                   });
//                 } else res.status(200);
//               });
//             } else
//               res.status(403).json({
//                 message: "You don't have permission to manage this guild's settings!"
//               });
//           })
//           .catch((error) => {
//             const message = error.message;
//             if (message === 'Unknown Member')
//               res.status(403).json({
//                 message: 'You are not in the guild you requested.'
//               });
//             else
//               res.status(500).json({
//                 message: 'An internal error occured. Please try again later.'
//               });
//           });
//       }
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: 'An error occured. Please try again later.'
//       });
//       console.log(err.message);
//     });
// });

app.get('/guilds', (req, res) => {
  if (!req.headers['access-token']) {
    res.status(400).json({
      message: 'Missing authentication.'
    });
    return;
  }

  fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `Bearer ${req.headers['access-token']}`
    }
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.message) res.status(401).json(json);
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
        res.status(200).json(guilds);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'An error occured. Please try again later.'
      });
      console.log(err.message);
    });
});

module.exports = {
  startExpress(botClient) {
    client = botClient;
    server = app.listen(4000);
  }
};
