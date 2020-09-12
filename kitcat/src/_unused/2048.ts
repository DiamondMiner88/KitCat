const Discord = require('discord.js');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

/**
 * The current running games. If one has ended, the data is set to undefined
 * {@Snowflake} guildID : {JSON object} game data
 */
var games = {};

/**
 * updateBoard - Displays the current board
 *
 * @param  {Channel} channel Channel the game is running in
 * @param  {Boolean} gameOver If the game is over, prints stats and final board, otherwise just prints board and current score
 * @returns {}
 */
async function updateBoard(channel, gameOver) {
  const data = games[channel.guild.id];
  var canvas = createCanvas(data.size * 214, data.size * 214);
  var ctx = canvas.getContext('2d');

  for (y = 0; y < data.size; y++) {
    for (x = 0; x < data.size; x++) {
      if (!data.tiles[x + ',' + y]) continue;
      await loadImage(
        path.join(__dirname, `/../assets/2048/tiles/${data.tiles[x + ',' + y].toString()}.PNG`)
      ).then((image) => {
        ctx.drawImage(image, x * 214, y * 214);
      });
    }
  }

  const embed = new Discord.MessageEmbed()
    .setTitle(`:two::zero::four::eight:`)
    .setDescription(`Score: ${data.score} | Moves: ${data.moves}`)
    .setColor(0xf9f5ea)
    .setImage('attachment://grid.png');

  var m = await channel.send({
    embed: embed,
    files: [{ attachment: canvas.createPNGStream(), name: 'grid.png' }]
  });
  if (!gameOver) {
    games[channel.guild.id].lastDisplayMsg = m;
    m.react('🔼');
    m.react('🔽');
    m.react('◀️');
    m.react('▶️');
  } else {
    games[channel.guild.id].lastDisplayMsg = undefined;
    channel.send('Game over!');
  }
}

/**
 * addNewTile - Adds a new tile to the board. 90% it is a 2, 10% it is a 4, only places in empty tiles. If no empty tiles exist, will do nothing.
 *
 * @param  {String} guildID Guild ID of the guild that contains the game you want to add a tile to
 * @returns {void}
 */
function addNewTile(guildID) {
  var emptyTileNames = Object.keys(games[guildID].tiles).filter(
    (tileName) => !games[guildID].tiles[tileName]
  );
  if (emptyTileNames.length === 0) return;
  const tileIndex = Math.floor(Math.random() * emptyTileNames.length);
  games[guildID].tiles[emptyTileNames[tileIndex]] = Math.random() < 0.9 ? 2 : 4;
}

/**
 * newGame - description
 *
 * @param  {Snowflake} channel Channel the command was executed in
 * @param  {Number} size Size of the board. ie. 4 = a 4x4 board
 * @returns {void}
 */
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
      data.tiles[x + ',' + y] = undefined;
    }
  }
  games[channel.guild.id] = data;
  addNewTile(channel.guild.id);
  addNewTile(channel.guild.id);
  updateBoard(channel, false);
}

/**
 * isGameOver - Checks if you cannot move anymore
 *
 * @param  {Guild} guild Guild that contains the game
 * @returns {Boolean} True if you cannot move, False otherwise
 */
function isGameOver(guild) {
  const data = games[guild.id];
  for (y = 0; y < data.size; y++) {
    for (x = 0; x < data.size; x++) {
      const curTile = data.tiles[x + ',' + y];
      if (!data.tiles[x + ',' + y]) return false;
      if (data.tiles[x + ',' + y - 1] === curTile) return false;
      if (data.tiles[x + ',' + y + 1] === curTile) return false;
      if (data.tiles[x + 1 + ',' + y] === curTile) return false;
      if (data.tiles[x - 1 + ',' + y] === curTile) return false;
    }
  }
  return true;
}

/**
 * moveTiles - Moves/Merges the tiles like in the real game
 *
 * @param  {Channel} channel The channel the game was started in
 * @param  {type} direction One of these: 🔼🔽◀️▶️
 * @returns {void}
 */
function moveTiles(channel, direction) {
  var data = games[channel.guild.id];
  var mergedTiles = [];
  switch (direction) {
    case '🔼':
      for (i = 0; i < 3; i++) {
        for (y = 0; y < data.size; y++) {
          for (x = 0; x < data.size; x++) {
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
    case '🔽':
      for (i = 0; i < 3; i++) {
        for (y = data.size - 1; y >= 0; y--) {
          for (x = 0; x < data.size; x++) {
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
    case '◀️':
      for (i = 0; i < 3; i++) {
        for (y = 0; y < data.size; y++) {
          for (x = 0; x < data.size; x++) {
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
    case '▶️':
      for (i = 0; i < 3; i++) {
        for (y = 0; y < data.size; y++) {
          for (x = data.size - 1; x >= 0; x--) {
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
  if (direction.match(/[🔼🔽◀️▶️]/g)) {
    data.moves++;
    games[channel.guild.id] = data;
    addNewTile(channel.guild.id);
    updateBoard(channel, isGameOver(channel.guild));
  }
}

module.exports = {
  command: '2048',
  category: require('./_CATEGORIES.js').games,
  help_name: `:1234: 2048`,
  help_description: `Play 2048 in Discord`,
  usage: `2048 help`,
  guildOnly: true,
  unlisted: false,

  /**
   * @param {Discord.Message} message
   * @param {Array.<String>} args
   */
  execute(message, args) {
    const pfx = message.client.guildSettingsCache.get(message.guild.id).prefix;
    switch (args[0]) {
      case 'help':
        var embed = new Discord.MessageEmbed()
        .setColor(0xf9f5ea)
          .setTitle('2048 commands:')
          .addField('help', `What you're looking at right now.\n\`${pfx}2048 help\``)
          .addField(
            'new',
            `Start a new game. *This cancels any current game*\n\`${pfx}2048 new {optional size: default: 4}\``
          )
          .addField('stop', `End the current game\n\`${pfx}2048 stop\``);
        message.channel.send(embed);
        break;
      case 'new':
        if (!args[1]) {
          message.channel.send("You didn't provide a size, using the default which is 4...");
          newGame(message.channel, 4);
        } else {
          if (isNaN(args[1])) message.channel.send('The size you provided was not a number');
          else if (Number(args[1]) > 10) message.channel.send('The maximum supported size is 10.');
          else newGame(message.channel, Number(args[1]));
        }
        break;
      case 'stop':
        updateBoard(message.channel, true);
        break;
      default:
        message.channel.send(
          `You didn't provide a valid subcommand! Do \`${pfx}2048 help\` for subcommands.`
        );
        break;
    }
  },

  /**
   * onReactionAdded - Should be called every time the {@Client} gets a onReactionAdded event called
   * Then calls {@moveTiles} if message matches and the user that added reaction isn't a bot
   *
   * @param  {MessageReaction} messageReaction The provided message reaction
   * @param  {User} user User that added the reaction
   * @returns {void}
   */
  onReactionAdded(messageReaction, user) {
    if (user.bot) return;
    if (!games[messageReaction.message.guild.id]) return;
    if (messageReaction.message === games[messageReaction.message.guild.id].lastDisplayMsg) {
      moveTiles(messageReaction.message.channel, messageReaction._emoji.name);
    }
  }
};
