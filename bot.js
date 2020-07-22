const config = require("./config/config.json");
const pfx = config.prefix;
const path = require('path');
const Discord = require("discord.js");
var db = require('./db.js').db;

var client = new Discord.Client();

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


client.commands = new Discord.Collection();
const commandFiles = require("fs").readdirSync(path.join(__dirname, '/commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  if (file[0] == "_") continue;
  const command = require(path.join(__dirname, './commands', file));
  client.commands.set(command.command, command);
}

client.on("ready", () => {
  console.log(`Bot is ready.`);
  client.user.setActivity(`${pfx}help | Serving ${client.guilds.cache.array().length} servers`);
});

client.on("guildMemberRemove", member => {
  var general = member.guild.systemChannel;
  if (general) general.send(`<@${member.user.id}> has left the server.`);
});

client.on("messageReactionAdd", (messageReaction, user) => {
  require("./commands/2048.js").onReactionAdded(messageReaction, user);
})

client.on("message", async message => {
  // Checks for blacklisted image attachments or cdn urls
  var url = undefined;
  if (message.attachments.size > 0) url = message.attachments.first().url;
  if (message.content.match(/http?s:\/\/cdn\.discordapp\.com\/attachments\/.+?(?=\/)\/.+?(?=\/)\/.+/g)) url = message.content;
  if (url !== undefined) {
    if (url.toLowerCase().indexOf("png", url.length - 3) !== -1) {
      require('image-hash').imageHash(url, 16, true, (error, hash) => {
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

  if (message.content.indexOf(pfx) !== 0) return; // Skip any messages that dont include the prefix at the front
  const args = message.content.slice(pfx.length).trim().split(" "); // args is an array of text after the command that were seperated by a whitespace
  const commandText = args.shift().toLowerCase(); // command is the word after the prefix

  const command = client.commands.get(commandText);
  if (command && command.guildOnly && message.channel.type !== 'text') message.channel.send("This command only works in Guild Text Channels!");
  else if (command && command.command === commandText) {
    db.get("SELECT * FROM commands WHERE guild=?", [message.guild.id], (err, result) => {
      if (err) {
        console.log("Error retrieving command data\n" + err.message);
        message.channel.send("Error retrieving command data\n" + err.message);
      }
      else {
        const other = {
          mode: 'enabled'
        }

        if (!result) {
          db.run("INSERT INTO commands (guild) VALUES(?)", [message.guild.id], err => {
            if (err) console.log("Error trying to add settings for guild: " + err);
          });
        }
        else other.mode = result[commandText];

        if (other.mode === 'disabled') message.channel.send("This command has been disabled on this server.");
        else command.execute(client, message, args, other);
      }
    });
  }
});

client.login(config.token);
