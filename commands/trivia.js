const config = require("../config.json");
const pfx = config.prefix;
const Discord = require('discord.js');
const fetch = require('node-fetch');
const Entities = require('html-entities').XmlEntities;
const { ReactionCollector } = require('discord.js')

const entities = new Entities();

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
        if (args.length != 0) {
            // if (input.length < 3) return message.channel.send("You didn't provide valid paramaters.");
            // console.log(input[1].toLowerCase().replace(/\s+/g, ''));
            var category = categories[input[0].toLowerCase().replace(/\s+/g, '')];
		    		var difficulty = selectedDifficulty[input[1].toLowerCase().replace(/\s+/g, '')];
		    		var toq = selectedType[input[2].toLowerCase().replace(/\s+/g, '')];

		    		if (category === undefined) return message.channel.send("You provided an invalid category!");
		    		if (difficulty === undefined) return message.channel.send("You provided an invalid difficulty!");
		    		if (toq === undefined) return message.channel.send("You provided an invalid type of question!")
		    		console.log(`${category}, ${difficulty}, ${toq}`);
		            //&category=${category}&difficulty=${difficulty}&type=${toq}
            if (category != "any")  url += `&category=${category}`;
            if (difficulty != "any") url += `&difficulty=${difficulty}`;
            if (toq != "any") url += `&type=${toq}`;
        }
        fetch(url, { method: 'Get' })
          .then(res => res.json())
          .then((json) => {
              // console.log(json);
							// console.log(json.results[0].correct_answer + ' ' + json.results[0].incorrect_answers);
							// console.log(entities.decode('What is Grumpy Cat&#039;s real name? In &quot;Super Mario Bros.&quot;, the clouds and bushes have the same artwork and are just different colors.'))
							var arrayAnswers = json.results[0].incorrect_answers;
							arrayAnswers.push(json.results[0].correct_answer);
							//  console.log(json);
							arrayAnswers.sort(function (a, b) {
								return 0.5 - Math.random();
							});
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
								.then(async function(msg) {
									await msg.react('🇹');
									await msg.react('🇫');
									var filter = (reaction, user) => reaction.emoji.name === '🇹' || reaction.emoji.name === '🇫';
									var collector = msg.createReactionCollector(filter, { time: 10000 });
									collector.on('collect', (reaction, reactionCollector) => {

									});
									collector.on('end', collected => {
											// TODO: Figure out how to get reactions, and tell users right answer along with who got it right
											// and who got it wrong.
									});
								});
							}
							// THIS CODE ACTUALLY WORKS, BUT I'M USING A DIFFERENT THING
								/*
								message.channel.send(embed)
									.then(function(msg) {
										msg.react('🇹');
										msg.react('🇫');
										msg.awaitReactions((reaction, user) => ((reaction.emoji.name === '🇫' && answers.correct_answer === 'False') || (reaction.emoji.name === '🇹' && answers.correct_answer === 'True'))
										, {max: 1, time: 10000}).then(collected => {

										});
									}).catch(function() {
										console.error("error");
									});
							}
							if (json.results[0].type === 'multiple') {
								message.channel.send(embed)
									.then(function(msg) {
										msg.react('1️⃣');
										msg.react('2️⃣');
										msg.react('3️⃣');
										msg.react('4️⃣')
									}).catch(function() {
										console.error("error");
									});
							}
						  // return message.channel.send();
							*/
        });
	}
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
