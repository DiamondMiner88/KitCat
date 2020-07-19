const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");
const Discord = require("discord.js");

// guildID: gameData
var games = {};

async function updateBoard(channel, isGameOver) {
  const data = games[channel.guild.id];
  var board = ``;
  if (!isGameOver) board += `Score: ${data.score}\n`;
  for (y = 0; y < data.size; y++) {
    for (x = 0; x < data.size; x++) {
      if (data.tiles[x + "," + y] === undefined) board += "- ";
      else board += data.tiles[x + "," + y] + " ";
    }
    board += "\n";
  }
  var m = await channel.send(board);
  if (!isGameOver) {
    games[channel.guild.id].lastDisplayMsg = m;
    m.react('🔼');
    m.react('🔽');
    m.react('◀️');
    m.react('▶️');
  }
  else {
    games[channel.guild.id].lastDisplayMsg = undefined;
    channel.send("\nYour score was " + games[channel.guild.id].score + " and you moved " + games[channel.guild.id].moves + " times.");
  }
}

function addNewTile(guildID) {
  var emptyTileNames = Object.keys(games[guildID].tiles).filter(tileName => games[guildID].tiles[tileName] === undefined);
  const tileIndex = Math.floor(Math.random() * emptyTileNames.length)
  games[guildID].tiles[emptyTileNames[tileIndex]] = Math.random() < 0.9 ? 2 : 4;
}

function newGame(channel, size) {
  const data = {
    size: size,
    moves: 0,
    score: 0,
    lastDisplayMsg: undefined,
    tiles: {}
  };
  for (x = 0; x < size; x++) {
    for (y = 0; y < size; y++) {
      data.tiles[x + "," + y] = undefined;
    }
  }
  games[channel.guild.id] = data;
  addNewTile(channel.guild.id);
  addNewTile(channel.guild.id);
  updateBoard(channel, false);
}

function isGameOver(channel) {
  const data = games[channel.guild.id];
  for (y = 0; y < data.size; y++) {
    for (x = 0; x < data.size; x++) {
      const curTile = data.tiles[x + "," + y];
      if (data.tiles[x + "," + y] === undefined) return false;
      if (data.tiles[x + "," + y - 1] === curTile) return false;
      if (data.tiles[x + "," + y + 1] === curTile) return false;
      if (data.tiles[x + 1 + "," + y] === curTile) return false;
      if (data.tiles[x - 1 + "," + y] === curTile) return false;
    }
  }
  return true;
}

function moveTiles(channel, direction) {
  var data = games[channel.guild.id];
  var mergedTiles = [];
  switch (direction) {
    case "🔼":
      for (i = 0; i < 3; i++) {
        for (y = 0; y < data.size; y++) {
          for (x = 0; x < data.size; x++) {
            //if tile is empty, skip it
            if (data.tiles[x + "," + y] === undefined) continue;
            // if the tile above is equal to the current tile, double the above's tile value and set this one to empty
            else if (data.tiles[x + "," + y] === data.tiles[x + "," + (y - 1)] && !mergedTiles.includes(x + "," + y)) {
              const value = data.tiles[x + "," + y];
              data.tiles[x + "," + y] = undefined;
              data.tiles[x + "," + (y - 1)] = value * 2;
              data.score += value * 2;
              mergedTiles.push(x + "," + (y - 1));
            }
            // If this tile isn't the top tile AND if the tile above is empty, then move the current tile's value one higher
            else if (data.tiles[x + "," + (y - 1)] === undefined && y !== 0) {
              data.tiles[x + "," + (y - 1)] = data.tiles[x + "," + y];
              data.tiles[x + "," + y] = undefined;
              if (mergedTiles.includes(x + "," + y)) {
                mergedTiles.splice(mergedTiles.indexOf(x + "," + y), 1);
                mergedTiles.push(x + "," + (y - 1));
              }
            }
          }
        }
      }
      break;
    case "🔽":
      for (i = 0; i < 3; i++) {
        for (y = data.size - 1; y >= 0; y--) {
          for (x = 0; x < data.size; x++) {
            //if tile is empty, skip it
            if (data.tiles[x + "," + y] === undefined) continue;
            // if the tile above is equal to the current tile, double the above's tile value and set this one to empty
            else if (data.tiles[x + "," + y] === data.tiles[x + "," + (y + 1)] && !mergedTiles.includes(x + "," + y)) {
              const value = data.tiles[x + "," + y];
              data.tiles[x + "," + y] = undefined;
              data.tiles[x + "," + (y + 1)] = value * 2;
              data.score += value * 2;
              mergedTiles.push(x + "," + (y + 1));
            }
            // If this tile isn't the top tile AND if the tile above is empty, then move the current tile's value one higher
            else if (data.tiles[x + "," + (y + 1)] === undefined && y !== data.size - 1) {
              data.tiles[x + "," + (y + 1)] = data.tiles[x + "," + y];
              data.tiles[x + "," + y] = undefined;
              if (mergedTiles.includes(x + "," + y)) {
                mergedTiles.splice(mergedTiles.indexOf(x + "," + y), 1);
                mergedTiles.push(x + "," + (y + 1));
              }
            }
          }
        }
      }
      break;
    case "◀️":
      for (i = 0; i < 3; i++) {
        for (y = 0; y < data.size; y++) {
          for (x = 0; x < data.size; x++) {
            //if tile is empty, skip it
            if (data.tiles[x + "," + y] === undefined) continue;
            // if the tile above is equal to the current tile, double the above's tile value and set this one to empty
            else if (data.tiles[x + "," + y] === data.tiles[(x - 1) + "," + y] && !mergedTiles.includes(x + "," + y)) {
              const value = data.tiles[x + "," + y];
              data.tiles[x + "," + y] = undefined;
              data.tiles[(x - 1) + "," + y] = value * 2;
              data.score += value * 2;
              mergedTiles.push((x - 1) + "," + y);
            }
            // If this tile isn't the top tile AND if the tile above is empty, then move the current tile's value one higher
            else if (data.tiles[(x - 1) + "," + y] === undefined && x !== 0) {
              data.tiles[(x - 1) + "," + y] = data.tiles[x + "," + y];
              data.tiles[x + "," + y] = undefined;
              if (mergedTiles.includes(x + "," + y)) {
                mergedTiles.splice(mergedTiles.indexOf(x + "," + y), 1);
                mergedTiles.push((x - 1) + "," + y);
              }
            }
          }
        }
      }
      break;
    case "▶️":
      for (i = 0; i < 3; i++) {
        for (y = 0; y < data.size; y++) {
          for (x = data.size - 1; x >= 0; x--) {
            //if tile is empty, skip it
            if (data.tiles[x + "," + y] === undefined) continue;
            // if the tile above is equal to the current tile, double the above's tile value and set this one to empty
            else if (data.tiles[x + "," + y] === data.tiles[(x + 1) + "," + y] && !mergedTiles.includes(x + "," + y)) {
              const value = data.tiles[x + "," + y];
              data.tiles[x + "," + y] = undefined;
              data.tiles[(x + 1) + "," + y] = value * 2;
              data.score += value * 2;
              mergedTiles.push((x + 1) + "," + y);
            }
            // If this tile isn't the top tile AND if the tile above is empty, then move the current tile's value one higher
            else if (data.tiles[(x + 1) + "," + y] === undefined && x !== data.size - 1) {
              data.tiles[(x + 1) + "," + y] = data.tiles[x + "," + y];
              data.tiles[x + "," + y] = undefined;
              if (mergedTiles.includes(x + "," + y)) {
                mergedTiles.splice(mergedTiles.indexOf(x + "," + y), 1);
                mergedTiles.push((x + 1) + "," + y);
              }
            }
          }
        }
      }
      break;
  }
  if (direction.match(/[🔼🔽◀️▶️]/g)) {
    data.moves++;
    games[channel.guild.id] = data;
    addNewTile(channel.guild.id);
    updateBoard(channel, isGameOver(channel));
  }
}

module.exports = {
  command: "2048",
  category: categories.games,
  help_name: `:1234: The game 2048`,
  help_description: `Play 2048 in Discord\n\`${pfx}2048 help\``,

  execute(client, message, args) {
    switch (args[0]) {
      case "help":
        var embed = new Discord.MessageEmbed()
          .setColor(0x0099ff)
          .setTitle("2048 commands:")
          .addField("help", `What you're looking at right now.\n\`${pfx}2048 help\``)
          .addField("new", `Start a new game. *This cancels any current game*\n\`${pfx}2048 new {optional size: default: 4}\``)
          .addField("stop", `End the current game\n\`${pfx}2048 stop\``);
        message.channel.send(embed);
        break;
      case "new":
        if (args[1] === undefined) {
          message.channel.send("You didn't provide a size, using the default which is 4...");
          newGame(message.channel, 4);
        }
        else {
          if (isNaN(args[1])) message.channel.send("The size you provided was not a number");
          else if (Number(args[1]) > 10) message.channel.send("The maximum supported size is 10.");
          else newGame(message.channel, Number(args[1]));
        }
        break;
      case "stop":
        updateBoard(message.channel, true);
        break;
      default:
        message.channel.send(`You didn't provide a valid subcommand! Do \`${pfx}2048 help\` for subcommands.`);
        break;
    }
  },

  onReactionAdded(messageReaction, user) {
    if (user.bot) return;
    if (games[messageReaction.message.guild.id] === undefined) return;
    if (messageReaction.message === games[messageReaction.message.guild.id].lastDisplayMsg) {
      moveTiles(messageReaction.message.channel, messageReaction._emoji.name);
    }
  }
}
