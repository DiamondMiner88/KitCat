const path = require('path');
const fs = require('fs');
const { category } = require('./commands/8ball');

var commands = [];

const commandFiles = fs
  .readdirSync(path.join(__dirname, '/commands'))
  .filter((file) => file.endsWith('.js') && !file.startsWith('_'));
for (const file of commandFiles) {
  const command = require(path.join(__dirname, './commands', file));
  if (command.unlisted) continue;

  commands.push({
    command: command.command,
    category: command.category,
    help_name: command.help_name,
    help_description: command.help_description,
    usage: command.usage,
    guildOnly: command.guildOnly
  });
}

console.log(commands);
