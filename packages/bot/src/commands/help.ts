import Discord from 'discord.js';
import { Command, CategoriesData, Categories } from '../commands';
import { client } from '../index';

const gh_issues = 'https://github.com/KitCat-Bot/KitCat/issues';
const footer = 'Format: `[]` => Optional, `{}` => Required, `|` => Or, `=` => default';

export default class Help extends Command {
  trigger = 'help';
  category = Categories.KITCAT;
  name = 'Help';
  description = `What you're looking at right now.`;
  usage = '[ Category | Command ]';
  guildOnly = false;
  unlisted = false;
  nsfw = false;

  invoke(message: Discord.Message, args: string[]): any {
    const embed = new Discord.MessageEmbed().setColor(0xf9f5ea);
    if (args.length === 0) {
      embed.setTitle('Categories');
      CategoriesData.forEach(c => embed.addField(c.name, `${c.description}\n\`/help ${c.name}\``));
    } else {
      const target: typeof CategoriesData[0] | Command | undefined =
        CategoriesData.find(c => c.name === args[0]) || client.commands.find(c => c.trigger === args[0]);
      if (!target) return message.channel.send(`No commands or categories under that name exist!`);

      if (target instanceof Command) {
        embed.setTitle(target.name);
        embed.addField(target.description !== '' ? target.description : '\u200B', target.formattedUsage);
      } else {
        embed.setTitle(target.name).setDescription(target.description);
        client.commands
          .filter(c => CategoriesData[c.category].name === target.name && !c.unlisted)
          .forEach(c => embed.addField(c.name, c.description + '\n' + c.formattedUsage));
      }
    }
    embed.addField('Bugs', `Found an issue? Report it [here](${gh_issues}) or do /foundBug`).setFooter(footer);
    message.channel.send(embed);
  }
}
