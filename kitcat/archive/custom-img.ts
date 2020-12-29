import Discord from 'discord.js';
import { IGuildSettings } from '../settings';
import { Command } from '../commands';

export default class CustomImg extends Command {
    trigger = 'custom-img';
    category = 'fun';
    name = '📷 Photo Commands';
    description = 'Image commands to make kool custom photos.';
    usage = 'help';
    guildOnly = false;
    unlisted = false;
    nsfw = false;

    run(message: Discord.Message, args: string[], settings: IGuildSettings): any {
        const prefix = settings ? settings.prefix : 'k!';
        if (args.length === 0)
            return message.channel.send(
                `You didn't provide any image command to run! Do \`${prefix}${this.trigger} help\` for a list!`
            );
        const subcommand = args.shift();
        switch (subcommand) {
            case 'help':
                return message.channel.send(
                    new Discord.MessageEmbed()
                        .setTitle('Image Commands')
                        .setColor(0xf9f5ea)
                        .addField(
                            'Minecraft Achievement',
                            `Make custom Minecraft achievement.\n\`${prefix}${this.trigger} minecraft {achievement}\``
                        )
                );
            case 'mc':
                return message.channel.send(
                    `https://minecraftskinstealer.com/achievement/3/Achievement%20Get%21/${encodeURIComponent(
                        args.join(' ')
                    )}`
                );
        }
    }
}
