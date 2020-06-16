//https://discordapp.com/oauth2/authorize?&client_id=713778178967076945&scope=bot&permissions=8
const config = require("./config.json");
const pfx = config.prefix;
const fs = require('fs');
const path = require('path');
const Discord = require("discord.js");
const client = new Discord.Client();

// Run on exit
if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function() {
    process.emit("SIGINT");
  });
}
process.on("SIGINT", function() {
  console.log(`Exiting...`);
  client.destroy();
  process.exit();
});

//concept from https://github.com/moonstar-x/discord-tts-bot/blob/cb86e98488d76870a2f857ded6371bd6f4ff8329/src/app.js
var commands = new Discord.Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, '/commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(path.join(__dirname, './commands', file));
  commands.set(command.command, command);
}

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.cache.array().length} users, in ${client.channels.cache.array().length} channels of ${client.guilds.cache.array().length} guilds.`);
  client.user.setActivity(`${pfx}help`)
});

client.on("guildMemberRemove", member => {
  channel = member.guild.channels.cache.find(channel => channel.name === 'welcome');
  if (channel !== undefined) channel.send(`\`${member.user.tag}\` has left the server.`);
  else console.log(`welcome channel is missing`);
});

client.once("reconnecting", () => {
  console.log("Reconnecting to discord...");
});

client.once("disconnect", () => {
  console.log("Disconnected from discord...");
});

client.on("message", async message => {
  require("./moderation_commands.js").testBlacklistImage(message);

  var weebAliases = ['weeb', 'weeabo', 'wee b', 'w e e b', 'w eeb', 'weeab o', 'we_eb', 'weeeb', 'weeeeb', 'w_eeb', 'w e eb', 'wee  b', 'weebs'];
  for (var index = 0; index < weebAliases.length; index++) {
    if (message.content.toLowerCase().includes(weebAliases[index])) {
      message.delete();
      return;
    }
  }

  if (message.author.bot) return;

  require("./reddit.js").linkImagesFromPosts(message);

  if (message.content.indexOf(pfx) !== 0) return; // Skip any messages that dont include the prefix at the front
  const args = message.content.slice(pfx.length).trim().split(/ +/g); // args is an array of text after the command that were seperated by a whitespace
  const commandText = args.shift().toLowerCase(); // command is the word after the prefix

  const command = commands.get(commandText);
  if (command) command.execute(client, message, args);
});

client.login(config.token);
