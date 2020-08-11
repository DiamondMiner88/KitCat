const path = require('path');
const fs = require('fs');
const { category } = require('./commands/8ball');
const emoji = require('node-emoji');

var commands = {};

const commandFiles = fs
  .readdirSync(path.join(__dirname, '/commands'))
  .filter((file) => file.endsWith('.js') && !file.startsWith('_'));
for (const file of commandFiles) {
  const command = require(path.join(__dirname, './commands', file));
  if (command.unlisted) continue;
  if (!commands[emoji.emojify(command.category.help_name)]) {
    commands[emoji.emojify(command.category.help_name)] = [];
  }
  commands[emoji.emojify(command.category.help_name)].push({
    command: emoji.emojify(command.command, (emojiname) => emoji.get(emojiname)), // emoji.emojify(command.command),
    help_name: emoji.emojify(command.help_name, (emojiname) => emoji.get(emojiname)), // emoji.emojify(command.help_name),
    help_description: emoji.emojify(command.help_description, (emojiname) => emoji.get(emojiname)), // emoji.emojify(command.help_description),
    usage: command.usage,
    guildOnly: command.guildOnly
  })
}
fs.writeFile('./commands.txt', JSON.stringify(commands), (err) => {
  if (err) {
    console.error(err);
  }
})
// console.log(commands);
