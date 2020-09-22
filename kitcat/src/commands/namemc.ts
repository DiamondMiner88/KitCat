import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './_Command';
import fetch from 'node-fetch';
import dateformat from 'dateformat';
import markdownescape from '../util/markdownescape';

export class NameMC extends Command {
  constructor() {
    super();
    this.executor = 'namemc';
    this.category = 'util';
    this.display_name = 'Minecarft Username History';
    this.description = `See usernames's skin, username history, and a link to thier NameMC.`;
    this.usage = '{username}';
    this.guildOnly = false;
    this.unlisted = false;
    this.nsfw = false;
  }

  run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    if (args.length === 0) return message.channel.send("You didn't provide a username. :P");
    fetch(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`)
      .then(res => res.json())
      .then(user => {
        fetch(`https://api.mojang.com/user/profiles/${user.id}/names`)
          .then(res => res.json())
          .then(names => {
            let embed = new Discord.MessageEmbed()
              .setTitle(user.name)
              .setDescription('Usernames:')
              .setColor(0xf9f5ea)
              .setURL(`https://namemc.com/profile/${user.name}`)
              .setImage(`https://minotar.net/armor/body/${user.name}/100.png`);

            if (names.error)
              return message.channel.send(
                names.errorMessage +
                  '\nPlease try again in a few seconds. I have no idea why this happens. Will try to fix later.'
              );

            names.forEach((name: any) => {
              // const date = dayjs(name.changedToAt).utc().format('MMM D, YYYY h:mm:ss A');
              const date = 'temp';
              embed.addField(
                markdownescape(name.name),
                markdownescape(name.changedToAt ? `${date} UTC` : 'Initial username')
              );
            });

            message.channel.send(embed);
          })
          .catch(error => message.channel.send(error.message));
      })
      .catch(error => {
        if (error.message.startsWith('invalid json response body at'))
          message.channel.send('This this not a valid user!');
        else {
          console.error(error.message);
          message.channel.send(error.message);
        }
      });
  }
}