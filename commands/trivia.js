const config = require("../config.json");
const pfx = config.prefix;
const Discord = require('discord.js');
const fetch = require('node-fetch');
const Entities = require('html-entities').XmlEntities;
const { ReactionCollector } = require('discord.js')

const entities = new Entities();

/*
easy questions give you 1 coin
medium give 2 take away 1 if wrong
hard give 4 take away 3 if wrong
*/

// https://opentdb.com/api_config.php
const categories = {
    'generalknowledge':'any',
    'entertainment:books':9,
    'entertainment:film':10,
    'entertainment:music':11,
    'entertainment:musicals&theatres':12,
    'entertainment:television':13,
    'entertainment:videogames':14,
    'entertainment:boardgames':15,
    'science&amp;nature':16,
    'science:computers':17,
    'science:mathematics':18,
    'mythology':19,
    'sports':20,
    'geography':21,
    'history':22,
    'politics':23,
    'art':24,
    'celebrities':25,
    'animals':26,
    'vehicles':27,
    'entertainment:comics':28,
    'science:gadgets':29,
    'entertainment:japaneseanime&manga':30,
    'entertainment:cartoon&animations':31
}

const selectedDifficulty = {
    'anydifficulty': 'any',
    'easy': 'easy',
    'medium': 'medium',
    'hard': 'hard'
}

const selectedType = {
    'anytype': 'any',
    'multiplechoice': 'multiple',
    'truefalse': 'boolean'
}

const triviaHelp = new Discord.MessageEmbed()
    .setColor('#00008B')
    .setTitle('Trivia Help')
    .addField('Categories', '`General Knowledge`, `Entertainment: Books`, `Entertainment: Film`, `Entertainment: Music`, `Entertainment: Musicals & Theatres`, `Entertainment: Television`, `Entertainment: Video Games`, `Entertainment: Board Games`, `Science &amp; Nature`, `Science: Computers`, `Science: Mathematics`, `Mythology`, `Sports`, `Geography`, `History`, `Politics`, `Art`, `Celebrities`, `Animals`, `Vehicles`, `Entertainment: Comics`, `Science: Gadgets`, `Entertainment: Japanese Anime & Manga`, `Entertainment: Cartoon & Animations`')
    .addField('Difficulties', '`Any Difficulty`, `Easy`, `Medium`, `Hard`')
    .addField('Type of Questions', '`Any Type`, `Multiple Choice`, `True False`')
    .addField('Ussage', `\`\`${pfx}trivia \`{category}\` \`{difficulty}\` \`{type}\` \`\` or run \`${pfx}trivia\` for any category, any difficulty, and any type of question.`);
;

const boolQuestionFilterArray = [
	'🇹',
	'🇫'
]

const multipleQuestionFilterArray = [
	'1️⃣',
	'2️⃣',
	'3️⃣',
	'4️⃣'
]

module.exports = {
    command: "trivia",
    category: "fun",
    help_name: `:question: Trivia`,
    help_description: `Asks a trivia question!\n\`\`${pfx}trivia \`{category}\` \`{difficulty}\` \`{type}\` \`\`.\nRun \`${pfx}trivia help\` for help with the trivia command.`,
    execute(client, message, args) {
        if (args[0] === "help") {
            return message.channel.send(triviaHelp);
        }
        var input = args.join(' ').split('`').filter(function(str) {
            return /\S/.test(str);
        });
        var url = `https://opentdb.com/api.php?amount=1`;
		var user = message.author;
        if (args.length != 0) {
            // if (input.length < 3) return message.channel.send("You didn't provide valid paramaters.");
            // console.log(input[1].toLowerCase().replace(/\s+/g, ''));
            var category = categories[input[0].toLowerCase().replace(/\s+/g, '')];
		    		var difficulty = selectedDifficulty[input[1].toLowerCase().replace(/\s+/g, '')];
		    		var toq = selectedType[input[2].toLowerCase().replace(/\s+/g, '')];

		    		if (category === undefined) return message.channel.send("You provided an invalid category!");
		    		if (difficulty === undefined) return message.channel.send("You provided an invalid difficulty!");
		    		if (toq === undefined) return message.channel.send("You provided an invalid type of question!")
		    		// console.log(`${category}, ${difficulty}, ${toq}`);
		            //&category=${category}&difficulty=${difficulty}&type=${toq}
            if (category != "any")  url += `&category=${category}`;
            if (difficulty != "any") url += `&difficulty=${difficulty}`;
            if (toq != "any") url += `&type=${toq}`;
        }
        fetch(url, { method: 'Get' })
          .then(res => res.json())
          .then((json) => {
				var arrayAnswers = json.results[0].incorrect_answers;
				arrayAnswers.push(json.results[0].correct_answer);
				arrayAnswers = shuffle(arrayAnswers);
				var answers = {
					answers: arrayAnswers,
					correct_answer: json.results[0].correct_answer,
					incorrect_answers: json.results[0].incorrect_answers,
					question: entities.decode(json.results[0].question)
				};
				var embed = new Discord.MessageEmbed()
					.setColor('#00008B')
			  	.setTitle("Trivia Question!")
					.addField("Category", json.results[0].category, true)
				if (json.results[0].type === 'boolean') embed.addField("Type", "True / False", true);
				if (json.results[0].type === 'multiple') embed.addField("Type", "Multiple Choice", true);
				embed.addField("Difficulty", json.results[0].difficulty.charAt(0).toUpperCase() + json.results[0].difficulty.slice(1), true)
						.addField("Question", answers.question);
				if (json.results[0].type === 'multiple') embed.addField(`Options`, `1: \`${answers.answers[0]}\`, 2: \`${answers.answers[1]}\`, 3: \`${answers.answers[2]}\`, 4: \`${answers.answers[3]}\`` +
									`.\nRespond with the corresponding Emoji to answer the question!`);
				if (json.results[0].type === 'boolean') {
					message.channel.send(embed)
					.then(function(msg) {
						msg.react('🇹');
						msg.react('🇫');
						const filter = (reaction, userperson) => {
							return boolQuestionFilterArray.includes(reaction.emoji.name) && userperson.id === message.author.id;
						}

						msg.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] }).then(collected => {
							collected.each(reaction => {
								if ((reaction._emoji.name === '🇫' && answers.correct_answer === 'False') || (reaction._emoji.name === '🇹' && answers.correct_answer === 'True')) {
									return message.channel.send(`<@${user.id}>, correct! The answer to \`${answers.question}\` is \`${answers.correct_answer}\``);
								} else {
									return message.channel.send(`<@${user.id}>, incorrect. The answer to \`${answers.question}\` is \`${answers.correct_answer}\``);
								}
							});
						}).catch(err => {
							return message.channel.send(`<@${user.id}>, you ran out of time!`);
						});
					});
				}
				if (json.results[0].type === 'multiple') {
					console.log(answers);
					message.channel.send(embed)
					.then(function(msg) {
						msg.react('1️⃣');
						msg.react('2️⃣');
						msg.react('3️⃣');
						msg.react('4️⃣');
						const filter = (reaction, userperson) => {
							return multipleQuestionFilterArray.includes(reaction.emoji.name) && userperson.id === message.author.id;
						}
						console.log(answers.correct_answer);
						msg.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] }).then(collected => {
							collected.each(reaction => {
								if (reaction._emoji.name === multipleQuestionFilterArray[answers.answers.indexOf(answers.correct_answer)]) {
									return message.channel.send(`<@${user.id}>, correct! The answer to \`${answers.question}\` is \`${answers.correct_answer}\``);
								} else {
									return message.channel.send(`<@${user.id}>, incorrect. The answer to \`${answers.question}\` is \`${answers.correct_answer}\``);
								}
							});
						}).catch(err => {
							return message.channel.send(`<@${user.id}>, you ran out of time!`);
						});
					}).catch(function() {
						console.error("error");
					});
				}
        	});
	}
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// You changed some crap here
/*
 General Knowledge
 Entertainment: Books
 Entertainment: Film
 Entertainment: Music
 Entertainment: Musicals &amp; Theatres
 Entertainment: Television
 Entertainment: Video Games
 Entertainment: Board Games
 Science &amp; Nature
 Science: Computers
 Science: Mathematics
 Mythology
 Sports
 Geography
 History
 Politics
 Art
 Celebrities
 Animals
 Vehicles
 Entertainment: Comics
 Science: Gadgets
 Entertainment: Japanese Anime & Manga
 Entertainment: Cartoon & Animations
select
*/
