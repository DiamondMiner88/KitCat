const config = require("../config/config.json");
const pfx = config.prefix;
const Discord = require('discord.js');

module.exports = {
  command: "roulette",
  category: require("./_CATEGORIES.js").games,
  help_name: `:gun: Russian Roulette`,
  help_description: `Play Russian Roulette in Discord.\n\`${pfx}roulette {people you want to play with}\`.\nExample: \`${pfx}roulette @Person1 @Person2 @Person3\``,
  guildOnly: true,
  unlisted: false,

  execute(client, message, args) {
		// console.log(message.mentions.members.first(message.mentions.members.size));
		if (args[0] === 'help') {
			return message.channel.send(new Discord.MessageEmbed()
				.setTitle('Russian Roulette Help')
				.addField('Start Game', `Start the game by typing \`${pfx}roulette {users}\`.`)
				.addField('Rules', `When it's your turn, you can do 2 things. Try your luck by running \`shoot myself\` or try to shoot someone else by running \`shoot {user}\`.`)
			);
		}
		var users_nofilter = message.mentions.members.first(message.mentions.members.size);
		users_nofilter.push(message.author);
		// message.channel.send(users_nofilter);
		// console.log(removeCopies([1, 1, 2, 2, 2, 2, 2, 3]))
		if (users_nofilter.length === 1) return message.channel.send("You can't play Russian Roulette by yourself.");
		var users_id = [];
		var users_mentions = [];
		for (var number in users_nofilter) {
			users_id.push(users_nofilter[number].id);
			users_mentions.push(users_nofilter[number.id]);
		}
		users_id = removeCopies(users_id);
		users_mentions = removeCopies(users_mentions);
		var users = [];
		for (var number in users_id) {
			users.push(client.users.cache.get(users_id[number]));
		}
		if (users.length === 1) return message.channel.send("You can't play Russian Roulette by yourself.");
		// console.log(users);
		var randomUsers = shuffle(users);
		var randomUserId = [];
		for (var number in randomUsers) {
			randomUserId.push(randomUsers[number].id);
		}
		var playerCount = 0;
		var bulletCount = 0;
		var chamber = [0, 0, 0, 0, 0, 0];
		chamber[Math.floor((Math.random() * chamber.length))] = 1;
		// chamber = shuffle(chamber);
		playTurn(message, chamber, playerCount, randomUsers, randomUserId, bulletCount);
  }
}

function removeCopies(array) {
	return array.filter(function(elem, pos) {
		return array.indexOf(elem) == pos;
	});
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function playTurn(message, chamber, playerCount, randomUsers, randomUserId, bulletCount, invalidTurn = false) {
	/*
	console.log(chamber);
	console.log(bulletCount);
	console.log(randomUsers + ' ' + randomUserId);
	*/
	if (invalidTurn) {

	}
	var playedTurn = false;
		if (randomUsers.length === 1) return message.channel.send(`${randomUsers[0]} won the game.`);
		randomUsers.push(randomUsers[0]);
		randomUsers.splice(0, 1);
		randomUserId.push(randomUsers[0]);
		randomUserId.splice(0, 1)
		message.channel.send('Gun has been loaded.');
		randomUserId.splice(0, 1);
		message.channel.send(`${randomUsers[playerCount]} has the gun. Do you want to try to shoot yourself or someone else?`).then(() => {
			message.channel.awaitMessages(response => response.content.split(' ')[0].toLowerCase() === 'shoot' && response.author.id === randomUsers[playerCount].id, { // console.log(response.author.id + ' ' + randomUsers[playerCount].id) &&
				max: 1,
				time: 30000,
				erros: ['time']
			})
			.then((collected) => {
				// console.log(collected);
				var response = collected.first().content.split(' ');
				var author = collected.first().author;
				if (response[1].toLowerCase() === 'myself' || collected.first().mentions.users.first() === randomUsers[playerCount] || response[1][1] === 'm') {
					done = true;
					if (chamber[bulletCount] === 1) {
						message.channel.send('*Boom* You died, the chamber had a bullet in it.');
						randomUserId.splice(randomUserId.indexOf(author.id), 1);
						randomUsers.splice(randomUserId.indexOf(author), 1);
						if (randomUsers.length != 1) {
							message.channel.send('Added a bullet and spinning the revolver.');
							chamber = shuffle(chamber);
						}
					} else {
						message.channel.send('*Click* You survived, the bullet was not in the chamber.')
					}
					playedTurn = true;
					bulletCount += 1;
					playTurn(message, chamber, playerCount, randomUsers, randomUserId, bulletCount, true);
					return;
				} else {
					// console.log(collected.first().mentions.users.first().id);
					var deadPerson = collected.first().mentions.users.first();
					if (deadPerson === undefined) {
						message.channel.send(`Someone shot you becaues you didn't provide a valid user.`);
						randomUserId.splice(randomUserId.indexOf(randomUserId[playerCount]), 1);
						randomUsers.splice(randomUserId.indexOf(randomUsers[playerCount]), 1);
					} else {
						done = true;
						if (chamber[bulletCount] === 1) {
							message.channel.send(`*Boom* ${deadPerson} got killed by ${randomUsers[playerCount]}.`);
							randomUserId.splice(randomUserId.indexOf(deadPerson.id), 1);
							randomUsers.splice(randomUserId.indexOf(deadPerson), 1);
							if (randomUsers.length != 1) {
								message.channel.send('Added a bullet and spinning the revolver.');
								chamber = shuffle(chamber);
							}
						}
						if (chamber[bulletCount] === 0) {
							message.channel.send(`*Click* The chamber was empty.`)
						}
						playedTrun = true;
						bulletCount += 1;
						playTurn(message, chamber, playerCount, randomUsers, randomUserId, bulletCount);
						return;
					}
				}
			})
			.catch((err) => {
				if (!playedTurn){
					message.channel.send(`*Boom* Someone shot ${randomUsers[playerCount]} because they took too long.`);
					randomUserId.splice(randomUserId.indexOf(randomUserId[playerCount]), 1);
					randomUsers.splice(randomUserId.indexOf(randomUsers[playerCount]), 1);
				}
				console.error(err);
			});
		});
}

/*
while (playing) {
	if (randomUsers.length === 1) {
		console.log(randomUsers);
		playing = false;
	} else {
		message.channel.send(`<@${randomUsers[playerCount].id}> has the gun. You have 2 options. Try your luck on yourself, or try to try it on someone else. You have 10 seconds\n\`shoot myself\` or \`shoot {mentioned user}\``);
		var collecter = new Discord.MessageCollector(message.channel, m => randomUsers[playerCount].id, { time: 10000 });
		var doneMove = false;
		collecter.on('collect', message => {
			// console.log(message);
		});
		collecter.on('end', colelcted => {
			// console.log(collected);
			if (!doneMove) {
				message.channel.send(`${randomUsers[playerCount]} you took too long, so someone shot you.`);
				randomUsers.filter(e => e !== randomUsers);
			}
		});
	}
}
return message.channel.send(`<@${randomUsers[0].id}> has won the game.`);
// if (users.length === 0) return message.channel.send("You can't play Russian Roulette by yourself.");


// 	CODE TO CHECK IF USER REACTS


/*
message.channel.send(`React with :ok: if you want to play ${users_mentions.join(', ')}.`)
	.then(msg => {
		msg.react('🆗');
		const filter = (reaction, user) => {
			return reaction.emoji.name === '🆗' && users_id.includes(user.id);
		};
		var allReacted = false;
		msg.awaitReactions(filter, { // Sets await awaitReactions
			max: users.length,
			time: 20000, // 20 seconds im not stupid no for myself
			errors: ['time'] // Throws error, if time runs out
		}).then(collected => {
			collected.each(reaction => {
				if (reaction.count - 1 == users.length) {
					console.log('true');
					allReacted = true;
				}
			});
		}).catch(err => {
			return message.channel.send('Enough people did not react to play.');
		});
		console.log(allReacted);
		if (allReacted) {
			message.channel.send('Starting Game...');
			var randomUsers = shuffle(users);
			var playing = true;
			var playerCount = 0;
			var chamber = [0, 0, 0, 0, 0, 0];
			chamber[Math.floor((Math.random() * chamber.length))] = 1;
			console.log(chamber);
			message.channel.send('Gun has been loaded.');
			while (playing) {
				if (randomUsers.length === 1) {
					playing = false;
				}
				message.channel.send(`<@${randomUsers[playerCount].id}> has the gun. You have 2 options. Try your luck on yourself, or try to try it on someone else. You have 10 seconds\n\`shoot myself\` or \`shoot {mentioned user}\``);
				var collecter = new Discord.MessageCollector(message.channel, m => randomUsers[playerCount].id, { time: 10000 });
				var doneMove = false;
				collecter.on('collect', message => {
					console.log(message);
				});
				collector.on('end', colelcted => {
					console.log(collected);
					if (!doneMove) {
						message.channel.send(`<@${randomUsers}> you took too long, so someone shot you.`);
						randomUsers.filter(e => e !== randomUsers);
					}
				});
				return message.channel.send(`<@${randomUsers[0].id}> has won the game.`);
			}
		}
	});
	*/
