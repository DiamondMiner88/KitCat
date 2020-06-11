//https://discordapp.com/oauth2/authorize?&client_id=713778178967076945&scope=bot&permissions=8
const Discord = require("discord.js");
const fs = require('fs');
const config = require("./config.json");
const client = new Discord.Client();
const pfx = config.prefix;
const reddit_funcs = require("./reddit.js");

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

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.cache.array().length} users, in ${client.channels.cache.array().length} channels of ${client.guilds.cache.array().length} guilds.`);
  client.user.setActivity(`${pfx}help`)
});

// client.on("guildMemberRemove", member => {
//   channel = message.guild.channels.cache.find(channel => channel.name === 'welcome');
//   if (channel !== undefined) channel.send(`\`${message.author.tag}\` has left the server.`);
//   else console.log(`welcome channel is missing`);
// });

client.on("message", async message => {
  let fun_commands = require("./fun_commands.js");
  let moderation_commands = require("./moderation_commands.js");
  moderation_commands.testBlacklistImage(message);

  if (message.author.bot) return;

  reddit_funcs.linkImagesFromPosts(message);

  var weebAliases = ['weeb', 'weeabo', 'wee b', 'w e e b', 'w eeb', 'weeab o', 'we_eb', 'weeeb', 'weeeeb', 'w_eeb', 'w e eb', 'wee  b', 'weebs'];
  for (var index = 0; index < weebAliases.length; index++) {
    if (message.content.toLowerCase().includes(weebAliases[index])) {
      message.delete();
      return;
    }
  }

  if (message.content.indexOf(pfx) !== 0) return; // Skip any messages that dont include the prefix at the front

  const args = message.content.slice(pfx.length).trim().split(/ +/g); // args is an array of text after the command that were seperated by a whitespace
  const command = args.shift().toLowerCase(); // command is the word after the prefix

  if (command === "ping") {
    // Calculates ping between sending a message and editing it, giving a round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    let m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
  }
  else if (command === "help") {
    let help_commands = require("./help_commands.js");
    help_commands.help_commands(message, command, args);
  }
  else {
    fun_commands.fun_commands(message, command, args);
    moderation_commands.moderation_commands(message, command, args, client);
  }
});

client.login(config.token);
