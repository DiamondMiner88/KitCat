const path = require('path');
require('dotenv-flow').config({
  node_env: process.argv[2] || 'development',
  path: path.join(__dirname, 'config')
});
const Discord = require('discord.js');
const pfx = process.env.BOT_PREFIX;

var { db, addGuildToSettings } = require('./db.js');
var client = new Discord.Client();

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
  client.user.setActivity(`${pfx}help | Serving ${client.guilds.cache.array().length} servers`);
  require('./api.js').startExpress(client);
});

client.on('guildMemberRemove', (member) => {
  const general = member.guild.systemChannel;
  if (general) general.send(`${member.user} (${member.user.tag}) has left the server.`);
});

client.on('messageReactionAdd', (messageReaction, user) => {
  require('./commands/2048.js').onReactionAdded(messageReaction, user);
});

client.on('message', async (message) => {
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
  if (message.author.bot) return;

  if (message.mentions.has(client.user)) return message.channel.send(`Do ${pfx} for commands!`);

  const args = message.content.slice(pfx.length).trim().split(/ +/); // args is an array of text after the command that were seperated by a whitespace

  if (/\{\d{1,6}\}/.test(message.content)) {
    if (message.channel.type === 'dm') return require('./commands/nhentai.js').multiMatch(message);
    db.get('SELECT nhentai FROM commands WHERE guild=?', [message.guild.id], (err, result) => {
      if (err) {
        console.log('Error retrieving command data\n' + err.message);
        return message.channel.send('An error occured');
      } else if (result.nhentai === 'enabled')
        return require('./commands/nhentai.js').multiMatch(message);
      else if (result.nhentai === 'disabled')
        return message.channel.send('This command has been disabled on this server.');
      else if (!result.nhentai) return message.channel.send('An error occured');
    });
  }

  const commandName = args.shift().toLowerCase(); // command is the word after the prefix
  if (message.content.indexOf(pfx) !== 0) return; // Skip any messages that dont include the prefix at the front

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

client.login(process.env.BOT_TOKEN);
