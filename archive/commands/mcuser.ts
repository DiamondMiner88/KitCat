import Discord from 'discord.js';
import { Command, Categories } from '../commands';
import fetch from 'node-fetch';
import { logger } from '../logging';
// import dateformat from 'dateformat';

type MCAPIError = { error: string; errorMessage: string };
type MCAPIUsernameLookup = { name: string; id: string } & MCAPIError;
type MCAPIIDLookup = { name: string; changedToAt?: number }[] & MCAPIError;

export default class extends Command {
  trigger = 'mcuser';
  category = Categories.UTIL;
  name = 'Minecraft Username History';
  description = `See players's skin, username history, and a link to thier user page on namemc.`;
  usage = '{username}';
  guildOnly = false;
  unlisted = false;
  nsfw = false;

  invoke(message: Discord.Message, args: string[]): any {
    if (args.length === 0) return message.channel.send(`You didn't provide a username.`);
    fetch(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`)
      .then(res => res.json())
      .then((user: MCAPIUsernameLookup) =>
        fetch(`https://api.mojang.com/user/profiles/${user.id}/names`)
          .then(res => res.json())
          .then((names: MCAPIIDLookup) => {
            const embed = new Discord.MessageEmbed()
              .setTitle(user.name)
              .setDescription('Usernames:')
              .setColor(0xf9f5ea)
              .setURL(`https://namemc.com/profile/${user.name}`)
              .setImage(`https://minotar.net/armor/body/${user.name}/100.png`);

            if (names.error)
              return message.channel.send(
                names.errorMessage + '\nPlease try again in a few seconds. I have no idea why this happens. Will try to fix later.',
              );

            names.forEach((name: any) => {
              // TODO: figure out the dates properly
              // const date = dayjs(name.changedToAt).utc().format('MMM D, YYYY h:mm:ss A');
              const date = 'temp';
              embed.addField(
                Discord.Util.escapeMarkdown(name.name),
                Discord.Util.escapeMarkdown(name.changedToAt ? `${date} UTC` : 'Initial username'),
              );
            });

            return message.channel.send(embed);
          })
          .catch(error => message.channel.send(error.message)),
      )
      .catch(error => {
        if (error.message.startsWith('invalid json response body at')) message.channel.send('This this not a valid user!');
        else {
          logger.error(error);
          message.channel.send(error.message);
        }
      });
  }
}
