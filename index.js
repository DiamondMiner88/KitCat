const config = require("./config.json");
const pfx = config.prefix;
const fs = require('fs');
const path = require('path');
const Discord = require("discord.js");
var client = new Discord.Client();
const {
  imageHash
} = require('image-hash');

if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}
process.on("SIGINT", function() {
  console.log(`Exiting...`);
  client.destroy();
  process.exit();
});
require('./db.js');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, '/commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  if (file[0] == "_") continue;
  const command = require(path.join(__dirname, './commands', file));
  client.commands.set(command.command, command);
}

client.on("ready", () => {
  console.log(`Bot is ready.`);
  client.user.setActivity(`${pfx}help | Serving ${client.guilds.cache.array().length} servers`);
  setInterval(() => {
    require("./oofcoin.js").interest();
  }, 8.64e+7); // 8.64e+7 is 1 day in Milliseconds
});

client.on("guildMemberRemove", member => {
  var general = member.guild.systemChannel;
  console.log(general)
  if (general === null) general = member.guild.channels.cache.find(channel => channel.name === 'welcome');
  console.log(general)
  if (general) general.send(`<@${member.user.id}> has left the server.`);
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

  if (message.content.indexOf(pfx) !== 0) return; // Skip any messages that dont include the prefix at the front
  const args = message.content.slice(pfx.length).trim().split(/ +/g); // args is an array of text after the command that were seperated by a whitespace
  const commandText = args.shift().toLowerCase(); // command is the word after the prefix

  const command = client.commands.get(commandText);
  if (command && command.command === commandText) command.execute(client, message, args);
});

client.login(config.token);
