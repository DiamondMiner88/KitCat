import Discord from 'discord.js';
import { Command } from './CommandBase';

// const {}

export class TicTacToe extends Command {
    executor = 'tictactoe';
    category = 'games';
    display_name = 'Tic Tac Toe';
    description = 'Play Tic Tac Toe with your buds.';
    usage = '{mention}';
    guildOnly = true;
    unlisted = false;
    nsfw = false;

    run(message: Discord.Message, args: string[]): any {
        console.log(message.mentions.users.first());
    }
}
