import { Message, MessageCollector, MessageEmbed, Snowflake, TextChannel } from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';

type Game = {
    size: number;
    moves: number;
    score: number;
    tiles: Record<string, number>;
    collector: MessageCollector;
    lastMoveTime?: Date;
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const games: Record<Snowflake, Game> = {};

export class TwoThousandFortyEight extends Command {
    executor = '2048';
    category = 'games';
    display_name = ':1234: 2048';
    description = 'Play 2048 in Discord';
    usage = 'help';
    guildOnly = true;
    unlisted = false;
    nsfw = false;

    run(message: Message, args: string[], settings: IGuildSettings) {
        const { prefix } = settings;
        message.channel = message.channel as TextChannel;

        switch (args[0]) {
            case 'help':
                const embed = new MessageEmbed()
                    .setColor(0xf9f5ea)
                    .setTitle('2048 commands:')
                    .addField('help', `What you're looking at right now.\n\`${prefix}2048 help\``)
                    .addField(
                        'new',
                        `Start a new game. *This cancels any current game*\n\`${prefix}2048 new {optional size: default: 4}\``
                    )
                    .addField('stop', `End the current game\n\`2048 stop\``);
                message.channel.send(embed);
                break;
            case 'new':
                if (!args[1]) {
                    message.channel.send(`You didn't provide a size, using the default which is 4...`);
                    newGame(message.channel, 4);
                } else {
                    if (isNaN(+args[1])) message.channel.send('The size you provided was not a number');
                    else if (Number(args[1]) > 10) message.channel.send('The maximum supported size is 10.');
                    else newGame(message.channel, Number(args[1]));
                }
                break;
            case 'stop':
                updateBoard(message.channel);
                break;
            default:
                message.channel.send(
                    `You didn't provide a valid subcommand! Do \`${prefix}2048 help\` for subcommands.`
                );
                break;
        }
    }
}

async function updateBoard(channel: TextChannel) {
    const data = games[channel.guild.id];
    const canvas = createCanvas(data.size * 214, data.size * 214);
    const ctx = canvas.getContext('2d');

    for (let y = 0; y < data.size; y++) {
        for (let x = 0; x < data.size; x++) {
            if (!data.tiles[x + ',' + y]) continue;
            await loadImage(
                path.join(__dirname, `../../assets/2048/${data.tiles[x + ',' + y].toString()}.PNG`)
            ).then((image) => ctx.drawImage(image, x * 214, y * 214));
        }
    }

    const embed = new MessageEmbed()
        .setTitle(`2048`)
        .setDescription(`Score: ${data.score} | Moves: ${data.moves}`)
        .setColor(0xf9f5ea)
        .setFooter('Move by saying the direction or w/a/s/d')
        .setImage('attachment://grid.png');

    channel.send({
        embed,
        files: [{ attachment: canvas.createPNGStream(), name: 'grid.png' }],
    });
}

function addNewTile(guildID: Snowflake) {
    const emptyTileNames = Object.keys(games[guildID].tiles).filter((tileName) => !games[guildID].tiles[tileName]);
    if (emptyTileNames.length === 0) return;
    const tileIndex = Math.floor(Math.random() * emptyTileNames.length);
    games[guildID].tiles[emptyTileNames[tileIndex]] = Math.random() < 0.9 ? 2 : 4;
}

function newGame(channel: TextChannel, size: number) {
    const data: Game = {
        size,
        moves: 0,
        score: 0,
        collector: undefined,
        tiles: {},
    };
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            data.tiles[x + ',' + y] = undefined;
        }
    }
    games[channel.guild.id] = data;
    addNewTile(channel.guild.id);
    addNewTile(channel.guild.id);
    updateBoard(channel);

    data.collector = channel.createMessageCollector((m: Message) => !m.author.bot);

    const strToDirection: Record<string, Direction> = {
        up: 'UP',
        w: 'UP',

        left: 'LEFT',
        a: 'LEFT',

        down: 'DOWN',
        s: 'DOWN',

        right: 'RIGHT',
        d: 'RIGHT',
    };

    const alldirections = Object.keys(strToDirection);

    data.collector.on('collect', (message: Message) => {
        if (alldirections.includes(message.content.toLowerCase())) {
            moveTiles(channel, strToDirection[message.content.toLowerCase()]);
            updateBoard(channel);

            if (isGameOver(message.guild.id)) {
                message.channel.send('Game over!');
                data.collector.stop();
            }
        } else if (message.content.toLowerCase() === '2048 stop') {
            message.channel.send('Ok, ending game...');
            data.collector.stop();
        }
    });

    data.collector.on('end', () => updateBoard(channel).then(() => delete games[channel.guild.id]));
}

function isGameOver(guildid: Snowflake) {
    const data = games[guildid];
    for (let y = 0; y < data.size; y++) {
        for (let x = 0; x < data.size; x++) {
            const cur = data.tiles[x + ',' + y];
            if (cur === undefined) return false;
            if (data.tiles[x + ',' + (y - 1)] === cur) return false;
            if (data.tiles[x + ',' + (y + 1)] === cur) return false;
            if (data.tiles[x + 1 + ',' + y] === cur) return false;
            if (data.tiles[x - 1 + ',' + y] === cur) return false;
        }
    }
    return true;
}

function moveTiles(channel: TextChannel, direction: Direction) {
    const data = games[channel.guild.id];
    const mergedTiles: string[] = [];
    switch (direction) {
        case 'UP':
            for (let pass = 0; pass < 3; pass++) {
                for (let y = 0; y < data.size; y++) {
                    for (let x = 0; x < data.size; x++) {
                        // if tile is empty, skip it
                        if (!data.tiles[x + ',' + y]) continue;
                        // if the tile above is equal to the current tile, double the above's tile value and set this one to empty
                        else if (
                            data.tiles[x + ',' + y] === data.tiles[x + ',' + (y - 1)] &&
                            !mergedTiles.includes(x + ',' + y)
                        ) {
                            const value = data.tiles[x + ',' + y];
                            data.tiles[x + ',' + y] = undefined;
                            data.tiles[x + ',' + (y - 1)] = value * 2;
                            data.score += value * 2;
                            mergedTiles.push(x + ',' + (y - 1));
                        }
                        // If this tile isn't the top tile AND if the tile above is empty, then move the current tile's value one higher
                        else if (!data.tiles[x + ',' + (y - 1)] && y !== 0) {
                            data.tiles[x + ',' + (y - 1)] = data.tiles[x + ',' + y];
                            data.tiles[x + ',' + y] = undefined;
                            if (mergedTiles.includes(x + ',' + y)) {
                                mergedTiles.splice(mergedTiles.indexOf(x + ',' + y), 1);
                                mergedTiles.push(x + ',' + (y - 1));
                            }
                        }
                    }
                }
            }
            break;
        case 'DOWN':
            for (let pass = 0; pass < 3; pass++) {
                for (let y = data.size - 1; y >= 0; y--) {
                    for (let x = 0; x < data.size; x++) {
                        // if tile is empty, skip it
                        if (!data.tiles[x + ',' + y]) continue;
                        // if the tile above is equal to the current tile, double the above's tile value and set this one to empty
                        else if (
                            data.tiles[x + ',' + y] === data.tiles[x + ',' + (y + 1)] &&
                            !mergedTiles.includes(x + ',' + y)
                        ) {
                            const value = data.tiles[x + ',' + y];
                            data.tiles[x + ',' + y] = undefined;
                            data.tiles[x + ',' + (y + 1)] = value * 2;
                            data.score += value * 2;
                            mergedTiles.push(x + ',' + (y + 1));
                        }
                        // If this tile isn't the top tile AND if the tile above is empty, then move the current tile's value one higher
                        else if (!data.tiles[x + ',' + (y + 1)] && y !== data.size - 1) {
                            data.tiles[x + ',' + (y + 1)] = data.tiles[x + ',' + y];
                            data.tiles[x + ',' + y] = undefined;
                            if (mergedTiles.includes(x + ',' + y)) {
                                mergedTiles.splice(mergedTiles.indexOf(x + ',' + y), 1);
                                mergedTiles.push(x + ',' + (y + 1));
                            }
                        }
                    }
                }
            }
            break;
        case 'LEFT':
            for (let pass = 0; pass < 3; pass++) {
                for (let y = 0; y < data.size; y++) {
                    for (let x = 0; x < data.size; x++) {
                        // if tile is empty, skip it
                        if (!data.tiles[x + ',' + y]) continue;
                        // if the tile above is equal to the current tile, double the above's tile value and set this one to empty
                        else if (
                            data.tiles[x + ',' + y] === data.tiles[x - 1 + ',' + y] &&
                            !mergedTiles.includes(x + ',' + y)
                        ) {
                            const value = data.tiles[x + ',' + y];
                            data.tiles[x + ',' + y] = undefined;
                            data.tiles[x - 1 + ',' + y] = value * 2;
                            data.score += value * 2;
                            mergedTiles.push(x - 1 + ',' + y);
                        }
                        // If this tile isn't the top tile AND if the tile above is empty, then move the current tile's value one higher
                        else if (!data.tiles[x - 1 + ',' + y] && x !== 0) {
                            data.tiles[x - 1 + ',' + y] = data.tiles[x + ',' + y];
                            data.tiles[x + ',' + y] = undefined;
                            if (mergedTiles.includes(x + ',' + y)) {
                                mergedTiles.splice(mergedTiles.indexOf(x + ',' + y), 1);
                                mergedTiles.push(x - 1 + ',' + y);
                            }
                        }
                    }
                }
            }
            break;
        case 'RIGHT':
            for (let pass = 0; pass < 3; pass++) {
                for (let y = 0; y < data.size; y++) {
                    for (let x = data.size - 1; x >= 0; x--) {
                        // if tile is empty, skip it
                        if (!data.tiles[x + ',' + y]) continue;
                        // if the tile above is equal to the current tile, double the above's tile value and set this one to empty
                        else if (
                            data.tiles[x + ',' + y] === data.tiles[x + 1 + ',' + y] &&
                            !mergedTiles.includes(x + ',' + y)
                        ) {
                            const value = data.tiles[x + ',' + y];
                            data.tiles[x + ',' + y] = undefined;
                            data.tiles[x + 1 + ',' + y] = value * 2;
                            data.score += value * 2;
                            mergedTiles.push(x + 1 + ',' + y);
                        }
                        // If this tile isn't the top tile AND if the tile above is empty, then move the current tile's value one higher
                        else if (!data.tiles[x + 1 + ',' + y] && x !== data.size - 1) {
                            data.tiles[x + 1 + ',' + y] = data.tiles[x + ',' + y];
                            data.tiles[x + ',' + y] = undefined;
                            if (mergedTiles.includes(x + ',' + y)) {
                                mergedTiles.splice(mergedTiles.indexOf(x + ',' + y), 1);
                                mergedTiles.push(x + 1 + ',' + y);
                            }
                        }
                    }
                }
            }
            break;
    }

    data.moves++;
    games[channel.guild.id] = data;
    addNewTile(channel.guild.id);
}
