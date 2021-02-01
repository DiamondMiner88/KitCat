import Discord from 'discord.js';
import { Command } from '../commands';

const PEOPLE_HUG = [
    'https://media.giphy.com/media/4No2q4ROPXO7T6NWhS/giphy.gif',
    'https://media.giphy.com/media/vaXnKwhc4cAQU/giphy.gif',
    'https://media.giphy.com/media/PHZ7v9tfQu0o0/giphy.gif',
    'https://media.giphy.com/media/IRUb7GTCaPU8E/giphy.gif',
    'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif',
    'https://media.giphy.com/media/sUIZWMnfd4Mb6/giphy.gif',
    'https://media.giphy.com/media/3bqtLDeiDtwhq/giphy.gif',
    'https://media.giphy.com/media/rSNAVVANV5XhK/giphy.gif',
    'https://media.giphy.com/media/VXP04aclCaUfe/giphy.gif',
    'https://media.giphy.com/media/1MI7djBqXTWrm/giphy.gif',
    'https://media.giphy.com/media/szxw88uS1cq4M/giphy.gif',
    'https://media.giphy.com/media/pN4sNFDT0vEwU/giphy.gif',
    'https://media.giphy.com/media/GJ5ktSzR3ffos/giphy.gif',
    'https://media.giphy.com/media/3o6ZsTopjMRVkJXAWI/giphy.gif',
    'https://media.giphy.com/media/jTSOClK7HBoMaVn5Hi/giphy.gif',
];

export default class Hug extends Command {
    trigger = 'hug';
    category = 'fun';
    name = '🤗 Hug';
    description = 'Hug someone!';
    usage = '{Mention}';
    guildOnly = false;
    unlisted = false;
    nsfw = false;

    run(message: Discord.Message): any {
        const mentions = message.mentions.users;
        if (mentions.size === 0) return message.channel.send(`Who do you want to send a hug to?`);

        const hug = new Discord.MessageEmbed().setImage(PEOPLE_HUG[Math.floor(Math.random() * PEOPLE_HUG.length)]);

        if (mentions.has(message.author.id)) return message.channel.send('I see you need a hug!', hug);

        if (mentions.size === 1 && message.mentions.has(message.client.user))
            return message.channel.send('Thanks for the hug :blush:!', hug);

        const people = mentions
            .map((u) => (u === message.client.user ? `**${u.username}** (thanks! :blush:)` : `**${u.username}**`))
            .join(', ');

        return message.channel.send(`${people}, you got hugged by **${message.author.username}**!`, hug);
    }
}
