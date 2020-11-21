import Discord, { Guild, Message, MessageEmbed, Snowflake, TextChannel, VoiceChannel } from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import { bot } from '../bot';

const queue: Record<
    Snowflake,
    {
        channel: Snowflake;
        author: Snowflake;
        authorChannel: Snowflake;
        text: string;
    }[]
> = {};
const playing: Record<Snowflake, boolean> = {};

export class TTS extends Command {
    constructor() {
        super();
        this.executor = 'tts';
        this.category = 'util';
        this.display_name = `🤖 Text-To-Speech`;
        this.description = `Joins your VC and says what you want it to say!`;
        this.usage = '{Text}';
        this.guildOnly = true;
        this.unlisted = false;
        this.nsfw = false;
    }

    async run(message: Message, args: string[], settings: IGuildSettings) {
        if (args.length === 0) {
            const collector = message.channel.createMessageCollector(
                (m: Message) => m.author.id === message.author.id && m.channel.id === message.channel.id,
                { time: 5 * 60 * 1000 }
            );
            collector.on('collect', (m: Message) => {
                if (m.content.startsWith(`${settings.prefix}stop`)) collector.stop();
                else addToQueue(m);
            });
            collector.on('end', () => {
                message.channel.send(
                    `${message.author} I'm no longer listening to your messages. Run the command again for me to continue.`
                );
            });
            message.channel.send(
                `${message.author}, I'm listening to speak any messages you send here!\nSay \`${settings.prefix}stop\` for me to stop!`
            );
        } else {
            message.content = args.join(' ');
            addToQueue(message);
        }
    }
}

function addToQueue(message: Discord.Message) {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('You are not in a voice channel!');

    if (message.content.length > 100) return message.channel.send('Text exceeds 100 character limit.');

    if (!queue[message.guild.id]) queue[message.guild.id] = [];
    queue[message.guild.id].push({
        channel: channel.id,
        author: message.author.id,
        authorChannel: message.channel.id,
        text: message.content,
    });
    play(message.guild.id);
}

async function play(guildid: Snowflake) {
    if (queue[guildid]?.length === 0 || playing[guildid] === true) return;

    const toPlay = queue[guildid][0];

    let guild: Guild;

    try {
        guild = await bot.guilds.fetch(guildid);
    } catch (error) {
        return;
    }

    // @ts-expect-error
    const vc: VoiceChannel = guild.channels.resolve(toPlay.channel);
    if (!vc) {
        // @ts-expect-error
        const authorChannel: TextChannel = await guild.channels.resolve(toPlay.authorChannel);
        const embed = new MessageEmbed()
            .setTitle('TTS Error')
            .setColor(0xf9f5ea)
            .setDescription(`Could not find Voice Channel for TTS sent by <@${queue[guildid][0].author}>`)
            .addField('Text', `${toPlay.text.substring(0, 50)}`)
            .setFooter('Deleting all queue entries for that VC');
        authorChannel?.send(embed);
        queue[guildid] = queue[guildid].filter((e) => e.channel !== toPlay.channel);
        play(guildid);
        return;
    }

    const eText = encodeURIComponent(toPlay.text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${eText}&tl=en&client=tw-ob`;

    const connection = await vc.join();
    const dispatcher = connection.play(url);
    dispatcher.on('start', () => (playing[guildid] = true));
    dispatcher.on('finish', () => {
        queue[guildid].shift();
        playing[guildid] = false;

        play(guildid);
        setTimeout(() => {
            if (queue[guildid].length === 0) vc.leave();
        }, 1 * 60 * 1000);
    });
}
