const path = require('path');
require('dotenv-flow').config({
  node_env: process.argv[2] || 'development',
  path: path.join(__dirname, 'config')
});
const Discord = require('discord.js');
const NodeCache = require('node-cache');
const pfx = process.env.BOT_PREFIX;

var { db, addGuildToSettings } = require('./db.js');

var client = new Discord.Client();
client.guildSettingsCache = new NodeCache();

if (process.platform === 'win32') {
  var rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('SIGINT', function () {
    process.emit('SIGINT');
  });
}
process.on('SIGINT', function () {
  console.log(`Stopping Bot and API...`);
  client.destroy();
  process.exit();
});

client.commands = new Discord.Collection();
const commandFiles = require('fs')
  .readdirSync(path.join(__dirname, 'commands'))
  .filter((file) => file.endsWith('.js') && !file.startsWith('_'));
for (const file of commandFiles) {
  const command = require(path.join(__dirname, 'commands', file));
  client.commands.set(command.command, command);
}

client.on('ready', () => {
  console.log(`Bot is ready.`);
  client.user.setActivity(
    `Ping me for help | Serving ${client.guilds.cache.array().length} servers`
  );
  require('./api.js').startExpress(client);
});

client.on('guildMemberAdd', (member) => {
  cacheGuildSettings(member.guild).then(() => {
    const { dmTextEnabled, dmText } = client.guildSettingsCache.get(member.guild.id);
    if (dmTextEnabled === 1) member.user.send(dmText).catch(() => {});
  });
});

client.on('guildMemberRemove', (member) => {
  const general = member.guild.systemChannel;
  if (general) general.send(`${member.user} (${member.user.tag}) has left the server.`);
});

client.on('messageReactionAdd', (messageReaction, user) => {
  require('./commands/2048.js').onReactionAdded(messageReaction, user);
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  /*
  var url = undefined;
  if (message.attachments.size > 0) url = message.attachments.first().url;
  if (
    message.content.match(/http?s:\/\/cdn\.discordapp\.com\/attachments\/.+?(?=\/)\/.+?(?=\/)\/.+/g)
  )
    url = message.content;
  if (url) {
    if (url.toLowerCase().indexOf('png', url.length - 3) !== -1) {
      require('image-hash').imageHash(url, 16, true, (error, hash) => {
        if (error) throw error;
        require('./db.js').db.get(
          'SELECT * FROM image_blacklist WHERE hash=?',
          [hash],
          (err, result) => {
            if (err) console.log('Error trying get data: ' + err);
            if (result) message.delete();
          }
        );
      });
    }
  }
  */

  const settings =
    message.channel.type !== 'dm' ? await cacheGuildSettings(message.guild) : { prefix: 'k!' };
  const { prefix: pfx } = settings;

  if (message.mentions.has(client.user)) return message.channel.send(`Do ${pfx}help for commands!`);

  if (/\{\d{1,6}\}/.test(message.content)) {
    if (message.channel.type === 'dm') return require('./commands/nhentai.js').multiMatch(message);
    const enabled = JSON.parse(settings.commands).nhentai;
    if (enabled === 1) return require('./commands/nhentai.js').multiMatch(message);
    else if (enabled === 0)
      return message.channel.send('This command has been disabled on this server.');
  }

  const args = message.content.slice(pfx.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();
  if (message.content.indexOf(pfx) !== 0) return;

  const command = client.commands.get(commandName);
  if (command && command.guildOnly && message.channel.type !== 'text')
    message.channel.send('This command only works in Guild Text Channels!');
  else if (command && command.command === commandName) {
    if (message.channel.type === 'dm') command.execute(message, args);
    else {
      addGuildToSettings(message.guild.id)
        .then(() => {
          db.get(
            'SELECT commands FROM settings WHERE guild=?',
            [message.guild.id],
            (err, result) => {
              if (err) {
                console.log(err.message);
                message.channel.send('Error retrieving command data\n' + err.message);
              } else {
                if (JSON.parse(result.commands)[commandName] === 0)
                  message.channel.send(
                    'This command has been disabled on this server by administrators.'
                  );
                else command.execute(message, args);
              }
            }
          );
        })
        .catch((err) => message.channel.send(err));
    }
  }
});

function cacheGuildSettings(guild) {
  return new Promise((resolve, reject) => {
    if (client.guildSettingsCache.has(guild.id)) resolve(client.guildSettingsCache.get(guild.id));
    else {
      addGuildToSettings(guild.id).then(() => {
        db.get('SELECT * FROM settings WHERE guild = ?', [guild.id], (err, result) => {
          if (err) reject(err);
          else if (result.guild) {
            client.guildSettingsCache.set(
              guild.id,
              result,
              guild.memberCount > 10000 ? 60 * 60 * 4 : 60 * 60
            );
            resolve(result);
          }
        });
      });
    }
  });
}

client.login(process.env.BOT_TOKEN);
