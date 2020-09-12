import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './_Command';

export class Routlette extends Command {
  constructor() {
    super();
    this.executor = 'roulette';
    this.category = 'games';
    this.displayName = ':gun: Russian Roulette';
    this.description = 'Play Russian Roulette in Discord.';
    this.usage = 'roulette {Mentions of people you want to play with}';
    this.guildOnly = false;
    this.unlisted = false;
    this.nsfw = false;
  }

  run(message: Discord.Message, args: string[], settings: IGuildSettings) {
    const prefix = settings ? settings.prefix : 'k!';
    if (args[0] === 'help')
      return message.channel.send(
        new Discord.MessageEmbed()
        .setColor(0xf9f5ea)
          .setTitle('Russian Roulette Help')
          .addField('Start Game', `Start the game by typing \`${prefix}roulette {users}\`.`)
          .addField(
            'Rules',
            `When it's your turn, you can do 2 things. Try your luck by running \`shoot myself\` or try to shoot someone else by running \`shoot {user}\`.`
          )
      );

    var players = message.mentions.members.first(message.mentions.members.size);
    players.push(message.member);
    players = removeCopies(players);

    if (players.includes(message.member))
      return message.channel.send("You can't play Russian Roulette by yourself.");

    players = shuffle(players);

    var chamber = [0, 0, 0, 0, 0, 0];
    chamber[Math.floor(Math.random() * chamber.length)] = 1;
    playTurn(message, chamber, players, 0);
  }
}

function removeCopies(array: any[]) {
  return array.filter(function (elem: any, pos: any) {
    return array.indexOf(elem) === pos;
  });
}

function shuffle(a: Discord.GuildMember[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function playTurn(
  message: Discord.Message,
  chamber: number[],
  players: Discord.GuildMember[],
  bulletCount: number,
) {
  var playedTurn = false;
  if (players.length === 1) return message.channel.send(`${players[0]} won the game.`);
  players.push(players[0]);
  players.splice(0, 1);
  message.channel.send('Gun has been loaded.');
  message.channel
    .send(
      `${players[playerCount]} has the gun. Do you want to try to shoot yourself or someone else?`
    )
    .then(() => {
      message.channel
        .awaitMessages(
          (response) =>
            response.content.split(' ')[0].toLowerCase() === 'shoot' &&
            response.author.id === players[playerCount].id,
          {
            // console.log(response.author.id + ' ' + randomUsers[playerCount].id) &&
            max: 1,
            time: 30000,
            errors: ['time']
          }
        )
        .then((collected) => {
          // console.log(collected);
          var response = collected.first().content.split(' ');
          var author = collected.first().author;
          if (
            response[1].toLowerCase() === 'myself' ||
            players.includes(collected.first().mentions.members.first()) ||
            response[1][1] === 'm'
          ) {
            if (chamber[bulletCount] === 1) {
              message.channel.send('*Boom* You died, the chamber had a bullet in it.');
              players
                .map((user) => user.id)
                .splice(players.map((user) => user.id).indexOf(author.id), 1);
              players.splice(players.map((user) => user.id).indexOf(author.toString()), 1);
              if (players.length != 1) {
                message.channel.send('Added a bullet and spinning the revolver.');
                chamber = shuffle(chamber);
              }
            } else {
              message.channel.send('*Click* You survived, the bullet was not in the chamber.');
            }
            playedTurn = true;
            bulletCount += 1;
            playTurn(message, chamber, playerCount, players, bulletCount);
            return;
          } else {
            // console.log(collected.first().mentions.users.first().id);
            var deadPerson = collected.first().mentions.users.first();
            if (!deadPerson) {
              message.channel.send(`Someone shot you becaues you didn't provide a valid user.`);
              players
                .map((user) => user.id)
                .splice(
                  players
                    .map((user) => user.id)
                    .indexOf(players.map((user) => user.id)[playerCount]),
                  1
                );
              players.splice(players.map((user) => user.id).indexOf(players[playerCount]), 1);
            } else {
              if (chamber[bulletCount] === 1) {
                message.channel.send(`*Boom* ${deadPerson} got killed by ${players[playerCount]}.`);
                players
                  .map((user) => user.id)
                  .splice(players.map((user) => user.id).indexOf(deadPerson.id), 1);
                players.splice(players.map((user) => user.id).indexOf(deadPerson), 1);
                if (players.length != 1) {
                  message.channel.send('Added a bullet and spinning the revolver.');
                  chamber = shuffle(chamber);
                }
              }
              if (chamber[bulletCount] === 0) {
                message.channel.send(`*Click* The chamber was empty.`);
              }
              playedTurn = true;
              bulletCount += 1;
              playTurn(
                message,
                chamber,
                playerCount,
                players,
                players.map((user) => user.id),
                bulletCount
              );
              return;
            }
          }
        })
        .catch((err) => {
          if (!playedTurn) {
            message.channel.send(
              `*Boom* Someone shot ${players[playerCount]} because they took too long.`
            );
            players
              .map((user) => user.id)
              .splice(
                players.map((user) => user.id).indexOf(players.map((user) => user.id)[playerCount]),
                1
              );
            players.splice(players.map((user) => user.id).indexOf(players[playerCount]), 1);
          }
          console.error(err);
        });
    });
}
