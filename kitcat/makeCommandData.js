console.log('It will say "Connected to data.db!" This is normal.');

const path = require('path');
const fs = require('fs');
const emoji = require('node-emoji');

var data = {
  commands: [],
  categories: []
};

const categories = require(path.join(__dirname, '/commands/_CATEGORIES.js'));

for (const category in categories) {
  var catData = categories[category];
  catData.help_name = emoji.emojify(catData.help_name, (emojiname) => emoji.get(emojiname))
  catData.commands = [];
  data.categories.push(catData);
}

const commandFiles = fs
  .readdirSync(path.join(__dirname, '/commands'))
  .filter((file) => file.endsWith('.js') && !file.startsWith('_'));

for (const fileName of commandFiles) {
  const command = require(path.join(__dirname, './commands', fileName));
  if (command.unlisted) continue;
  const categoryI = data.categories.findIndex((item) => item === command.category);

  data.categories[categoryI].commands.push(command.command);

  data.commands.push({
    command: command.command,
    help_name: emoji.emojify(command.help_name, (emojiname) => emoji.get(emojiname)),
    help_description: emoji.emojify(command.help_description, (emojiname) => emoji.get(emojiname)),
    usage: command.usage,
    guildOnly: command.guildOnly
  });
}

fs.writeFile('./commands.json', JSON.stringify(data), (err) => {
  if (err) console.error(err);
  console.log('Wrote to commands.json');
});
