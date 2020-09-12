import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command, categories } from './_Command';
import { commands } from '../commands';

const gh_issues = 'https://github.com/KitCat-Bot/KitCat/issues';
const footer = 'Command format: `[]` = Optional, `{}` = Required, `|` = Or';

export class Help extends Command {
  constructor() {
    super();
    this.executor = 'help';
    this.category = 'kitcat';
    this.displayName = 'Help';
    this.description = `What you're looking at right now.`;
    this.usage = '[category]';
    this.guildOnly = false;
    this.unlisted = false;
    this.nsfw = false;
  }

  run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    const prefix = settings ? settings.prefix : 'k!';
    if (args.length === 0) {
      const help = new Discord.MessageEmbed()
        .setColor(0xf9f5ea)
        .setTitle('Categories')
        .setFooter(footer);
      categories.forEach((category) => {
        let desc = category.description !== '' ? category.description + '\n' : '';
        desc += `\`${prefix}help ${category.name}\``;

        help.addField(category.display_name, desc);
      });
      help.addField('Bugs', `See an issue? Report it [here](${gh_issues}).`);
      message.channel.send(help);
    } else if (!categories.some((category) => category.name === args[0])) {
      message.channel.send(`That category doesn't exist!`);
    } else {
      const category = categories.find((category) => category.name === args[0]);

      const help = new Discord.MessageEmbed()
        .setColor(0xf9f5ea)
        .setTitle('Commands')
        .setDescription(category.display_name)
        .setFooter(footer);

      commands
        .filter((command) => command.category === category.name)
        .forEach((command) => {
          const commandHelp = command.getCommandHelp(settings);
          help.addField(commandHelp[0], commandHelp[1]);
        });
      help.addField('Bugs', `See an issue? Report it [here](${gh_issues}).`);
      message.channel.send(help);
    }
  }
}
