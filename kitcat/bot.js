const path = require('path');
require('dotenv-flow').config({
  node_env: process.argv[2] || 'development',
  path: path.join(__dirname, 'config')
});
const Discord = require('discord.js');
const NodeCache = require('node-cache');
const pfx = process.env.BOT_PREFIX;
const UNDEFINED = undefined;

var { db, addGuildToSettings, acceptableCmds } = require('./db.js');

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
  cacheGuildSettings(member.guild).then((settings) => {
    const { dmTextEnabled, dmText } = settings;
    if (dmTextEnabled === 1) member.user.send(dmText).catch(() => {});
  });
});

// client.on('guildMemberRemove', (member) => {
//   const general = member.guild.systemChannel;
//   if (general) general.send(`${member.user} (${member.user.tag}) has left the server.`);
// });

client.on('messageReactionAdd', (messageReaction, user) => {
  require('./commands/2048.js').onReactionAdded(messageReaction, user);
});

client.on('message', async (message) => {
  if (message.author.bot) return;

  const settings =
    message.channel.type !== 'dm' ? await cacheGuildSettings(message.guild) : { prefix: 'k!' };
  const { prefix: pfx } = settings;
  const commands = JSON.parse(settings.commands);

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
  if (!command) return;
  if (command.guildOnly && message.channel.type !== 'text')
    message.channel.send('This command only works in Guild Text Channels!');
  else if (command.nsfw === false && !message.channel.nsfw)
    message.channel.send(
      "This is a NSFW command. Per Discord's policy, these can only be executed in NSFW channels."
    );
  else if (command.command === commandName) {
    if (message.channel.type === 'dm') command.execute(message, args);
    else {
      if (commands[commandName] === 1) command.execute(message, args);
      else if (commands[commandName] === 0)
        message.channel.send('This command has been disabled on this server.');
      else if (commands[commandName] === UNDEFINED) {
        if (acceptableCmds[commandName] === 1 || acceptableCmds[commandName] === UNDEFINED) {
          db.run('UPDATE settings SET commands = ?', [JSON.stringify(commands)], (err) => {
            if (err) {
              console.error(err);
              message.channel.send('An error occured. Please try again later.');
            }
            client.guildSettingsCache.del(message.guild.id);
            cacheGuildSettings(message.guild)
              .then(() => command.execute(message, args))
              .catch((err) => {
                message.channel.send(err);
                console.error(err);
              });
          });
        } else message.channel.send('This command has been disabled on this server.');
      }
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
