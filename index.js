const config = require("./config.json");
const pfx = config.prefix;
const fs = require('fs');
const path = require('path');
const Discord = require("discord.js");

var client = new Discord.Client();
const {
  imageHash
} = require('image-hash');
process.on("SIGINT", function() {
  console.log(`Exiting...`);
  client.destroy();
  process.exit();
});
require('./db.js');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, '/commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(path.join(__dirname, './commands', file));
  client.commands.set(command.command, command);
}

client.on("ready", () => {
  console.log(`Bot is ready.`);
  client.user.setActivity(`${pfx}help | Serving ${client.guilds.cache.array().length} servers`)
});

client.on("guildMemberRemove", member => {
  const general = member.guild.channels.cache.find(channel => channel.name === 'general');
  if (general) welcome.send(`<@${member.user.id}> has left or been kicked from the server.`);
});

client.on("messageReactionAdd", (messageReaction, user) => {
  require("./commands/2048.js").onReactionAdded(messageReaction, user);
})

client.on("message", async message => {
  var url = undefined;
  if (message.attachments.size > 0) url = message.attachments.first().url;
  if (message.content.match(/http?s:\/\/cdn\.discordapp\.com\/attachments\/.+?(?=\/)\/.+?(?=\/)\/.+/g)) url = message.content;
  if (url !== undefined) {
    if (url.toLowerCase().indexOf("png", url.length - 3) !== -1) {
      imageHash(url, 16, true, (error, hash) => {
        if (error) throw error;
        require("./db.js").db.get("SELECT * FROM image_blacklist WHERE hash=?", [hash], (err, result) => {
          if (err) console.log("Error trying get data: " + err);
          else {
            if (result !== undefined) message.delete();
          }
        });
      });
    }
  }

  if (message.author.bot) return;

  require("./reddit.js").linkImagesFromPosts(message);

  const nHmatches = message.content.matchAll(/\((\d{1,6})\)/g);
  for (const match of nHmatches) {
    require("./commands/nhentai.js").getOverview(match[1], message.channel, (error, overview) => {
      if (error) message.channel.send(error);
      else message.channel.send(overview);
    });
  }

  if (message.content.indexOf(pfx) !== 0) return; // Skip any messages that dont include the prefix at the front
  const args = message.content.slice(pfx.length).trim().split(/ +/g); // args is an array of text after the command that were seperated by a whitespace
  const commandText = args.shift().toLowerCase(); // command is the word after the prefix

  const command = client.commands.get(commandText);
  if (command) command.execute(client, message, args);
});

client.login(config.token);
