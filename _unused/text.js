const config = require('../config/config.json');
const pfx = config.prefix;
const Discord = require('discord.js');

const colors = ['green', 'cyan', 'blue', 'yellow', 'orange', 'red'];

const help = new Discord.MessageEmbed()
  .setColor(0x0099ff)
  .setTitle(':capital_abcd: Text')
  .addField(
    ':arrow_up_down: Random Case',
    `Changes the casing of the text randomly.\n\`${pfx}case {text}\``
  )
  .addField(
    ':rainbow: Color Commands',
    `Run \`${pfx}text {color} {text}\` to change the color of the text.\nColors: \`${colors.join(
      '`, `'
    )}\`.`
  );
/*
    .addField('Green Text', 'Changes the color of your text to green.', true)
    .addField('Cyan Text', 'Changes the color of your text to cyan.', true)
    .addField('Blue Text', 'Changes the color of your text to blue.', true)
    .addField('Yellow Text', 'Changes the color of your text to yellow.', true)
    .addField('Orange Text', 'Changes the color of your text to orange.', true)
    .addField('Red Text', 'Changes the color of your text to red.', true)
    */
// .addField('Green Text', `Changes the text you send to a green color`)
module.exports = {
  command: 'text',
  category: require('./_CATEGORIES.js.js').utils,
  help_name: `Text`,
  help_description: `Changes your text.\n\`${pfx}text help\``,
  guildOnly: false, // TODO: i have no idea what this command does, so edit this later
  unlisted: false,

  execute(message, args) {
    if (args[0] === 'help') {
      message.channel.send(help);
    }
    console.log(args);
    switch (args[0]) {
      case 'case':
        caseFunction(message, args.slice(1, args.length).join(' '));
      case 'green':
        color(message, args.slice(1, args.length).join(' '), 'diff', '+ ', ' +');
        break;
      case 'cyan':
        color(message, args.slice(1, args.length).join(' '), 'cs', '"    ', '\n');
        break;
      case 'blue':
        color(message, args.slice(1, args.length).join(' '), 'asciidoc', '= ', ' =');
        break;
      case 'yellow':
        color(message, args.slice(1, args.length).join(' '), 'autohotkey', '% ', ' %');
        break;
      case 'orange':
        color(message, args.slice(1, args.length).join(' '), 'css', '[ ', ' ]');
        break;
      case 'red':
        color(message, args.slice(1, args.length).join(' '), 'diff', '- ', ' -');
        break;
      default:
        return;
    }
  }
};

function caseFunction(message, text) {
  var output = '';
  for (var char in text) {
    if (Math.random() >= 0.5) {
      output += text[char].toUpperCase();
    } else {
      output += text[char].toLowerCase();
    }
  }
  output += `\n- ${message.author}`;
  message.delete();
  message.channel.send(output);
}

function color(message, text, color, colorStart = '', colorEnd = '') {
  message.channel.send(
    '```' + color + '\n' + colorStart + text + colorEnd + '```\n-' + message.author
  );
  message.delete();
}
