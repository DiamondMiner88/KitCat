const Discord = require('discord.js');
const pfx = process.env.BOT_PREFIX;
const fetch = require('node-fetch');
const Entities = require('html-entities').AllHtmlEntities;
var { db } = require('../db.js');
const entities = new Entities();

// https://opentdb.com/api_config.php
const categories = {
  any: 'any',
  generalknowledge: 9,
  'entertainment:books': 10,
  'entertainment:film': 11,
  'entertainment:music': 12,
  'entertainment:musicals&theatres': 13,
  'entertainment:television': 14,
  'entertainment:videogames': 15,
  'entertainment:boardgames': 16,
  'science&nature': 17,
  'science:computers': 18,
  'science:mathematics': 19,
  mythology: 20,
  sports: 21,
  geography: 22,
  history: 23,
  politics: 24,
  art: 25,
  celebrities: 26,
  animals: 27,
  vehicles: 28,
  'entertainment:comics': 29,
  'science:gadgets': 30,
  'entertainment:japaneseanime&manga': 31,
  'entertainment:cartoon&animations': 32
};
const selectedDifficulty = {
  any: 'any',
  easy: 'easy',
  medium: 'medium',
  hard: 'hard'
};
const selectedType = {
  any: 'any',
  multiplechoice: 'multiple',
  truefalse: 'boolean'
};
const triviaHelp = new Discord.MessageEmbed()
  .setColor('#00008B')
  .setTitle('Trivia Help')
  .addField(
    'Categories',
    '`Any`, `General Knowledge`, `Entertainment: Books`, `Entertainment: Film`, `Entertainment: Music`, `Entertainment: Musicals & Theatres`, `Entertainment: Television`, `Entertainment: Video Games`, `Entertainment: Board Games`, `Science &amp; Nature`, `Science: Computers`, `Science: Mathematics`, `Mythology`, `Sports`, `Geography`, `History`, `Politics`, `Art`, `Celebrities`, `Animals`, `Vehicles`, `Entertainment: Comics`, `Science: Gadgets`, `Entertainment: Japanese Anime & Manga`, `Entertainment: Cartoon & Animations`'
  )
  .addField('Difficulties', '`Any`, `Easy`, `Medium`, `Hard`')
  // .addField('Earn Money', '`Yes`, `No` (No by default)')
  .addField('Ussage', `\`trivia {optional: difficulty} {optional: category}\``);
const boolQuestionFilterArray = ['🇹', '🇫'];
const multipleQuestionFilterArray = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];

module.exports = {
  command: 'trivia',
  category: require('./_CATEGORIES.js').fun,
  help_name: `:question: Trivia`,
  help_description: `Asks a trivia question!. If you get the question right, you earn oof coins, if you get it wrong, you loose oofcoins.\nRun \`${pfx}trivia help\` for help with the trivia command.`,
  usage: `trivia {optional: difficulty} {optional: category}`,
  guildOnly: false,
  unlisted: false,

  /**
   * Shows random trivia
   * @param {Discord.TextChannel} message
   * @param {Array.<String>} args
   */
  execute(message, args) {
    require('../db.js').checkForProfile(message.author);
    if (args[0] === 'help') {
      return message.channel.send(triviaHelp);
    }
    var input = args
      .join(' ')
      .split('`')
      .filter(function (str) {
        return /\S/.test(str);
      });
    var url = `https://opentdb.com/api.php?amount=1`;
    var user = message.author;
    if (args.length > 0) {
      var category = categories[input.join('').toLowerCase().replace(/\s+/g, '')];
      var difficulty = 'any';

      if (!category) {
        category = categories[input.slice(1).join(' ').toLowerCase().replace(/\s+/g, '')];
        difficulty = selectedDifficulty[input[0].toLowerCase()];
        if (!input[0]) difficulty = 'any';
        if (!input[1]) category = 'any';
      }

      if (!difficulty) return message.channel.send('You provided an invalid difficulty!');
      if (!category) return message.channel.send('You provided an invalid category!');
      if (category !== 'any') url += `&category=${category}`;
      if (difficulty !== 'any') url += `&difficulty=${difficulty}`;
    }
    fetch(url, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((json) => {
        if (!difficulty) {
          var difficulty =
            json.results[0].difficulty.charAt(0).toUpperCase() +
            json.results[0].difficulty.slice(1);
        }
        var arrayAnswers = json.results[0].incorrect_answers;
        arrayAnswers.push(json.results[0].correct_answer);
        arrayAnswers = shuffle(arrayAnswers);
        var answers = {
          answers: arrayAnswers,
          correct_answer: json.results[0].correct_answer,
          incorrect_answers: json.results[0].incorrect_answers,
          question: json.results[0].question
        };

        var embed = new Discord.MessageEmbed()
          .setColor('#00008B')
          .setTitle('Trivia Question!')
          .addField('Category', json.results[0].category, true);
        if (json.results[0].type === 'boolean') embed.addField('Type', 'True / False', true);
        if (json.results[0].type === 'multiple') embed.addField('Type', 'Multiple Choice', true);
        embed
          .addField(
            'Difficulty',
            json.results[0].difficulty.charAt(0).toUpperCase() +
              json.results[0].difficulty.slice(1),
            true
          )
          .addField('Question', entities.decode(answers.question));
        if (json.results[0].type === 'multiple')
          embed.addField(
            `Options`,
            `1: \`${entities.decode(answers.answers[0])}\`, 2: \`${entities.decode(
              answers.answers[1]
            )}\`, 3: \`${entities.decode(answers.answers[2])}\`, 4: \`${entities.decode(
              answers.answers[3]
            )}\`` + `.\nRespond with the corresponding Emoji to answer the question!`
          );
        if (json.results[0].type === 'boolean') {
          message.channel.send(embed).then((msg) => {
            msg.react('🇹');
            msg.react('🇫');
            const filter = (reaction, userperson) => {
              return (
                boolQuestionFilterArray.includes(reaction.emoji.name) &&
                userperson.id === message.author.id
              );
            };

            msg
              .awaitReactions(filter, {
                max: 1,
                time: 15000,
                errors: ['time']
              })
              .then((collected) => {
                collected.each((reaction) => {
                  if (
                    (reaction._emoji.name === '🇫' && answers.correct_answer === 'False') ||
                    (reaction._emoji.name === '🇹' && answers.correct_answer === 'True')
                  ) {
                    return message.channel.send(
                      `<@${user.id}>, correct! \`${entities.decode(answers.question)}\` is \`${
                        answers.correct_answer
                      }\``
                    );
                  } else {
                    return message.channel.send(
                      `<@${user.id}>, incorrect. \`${entities.decode(answers.question)}\` is \`${
                        answers.correct_answer
                      }\``
                    );
                  }
                });
              })
              .catch((err) => {
                return message.channel.send(`<@${user.id}>, you ran out of time!`);
              });
          });
        }
        if (json.results[0].type === 'multiple') {
          message.channel
            .send(embed)
            .then(function (msg) {
              msg.react('1️⃣');
              msg.react('2️⃣');
              msg.react('3️⃣');
              msg.react('4️⃣');
              const filter = (reaction, userperson) => {
                return (
                  multipleQuestionFilterArray.includes(reaction.emoji.name) &&
                  userperson.id === message.author.id
                );
              };
              msg
                .awaitReactions(filter, {
                  max: 1,
                  time: 15000,
                  errors: ['time']
                })
                .then((collected) => {
                  collected.each((reaction) => {
                    const coinRates = {
                      Easy: {
                        lose: -1,
                        win: 2
                      },
                      Medium: {
                        lose: -3,
                        win: 4
                      },
                      Hard: {
                        lose: -4,
                        win: 6
                      }
                    };

                    var coinsEarned = 0;
                    if (
                      reaction._emoji.name ===
                      multipleQuestionFilterArray[answers.answers.indexOf(answers.correct_answer)]
                    )
                      coinsEarned = coinRates[difficulty].win;
                    else coinsEarned = coinRates[difficulty].lose;

                    if (coinsEarned > 0)
                      message.channel.send(
                        `<@${user.id}>, correct! The answer to \`${entities.decode(
                          answers.question
                        )}\` is \`${answers.correct_answer}\`.\nYou earned ${coinsEarned} oofcoins.`
                      );
                    else
                      message.channel.send(
                        `<@${user.id}>, incorrect! The answer to \`${entities.decode(
                          answers.question
                        )}\` is \`${answers.correct_answer}\`.\n You lost ${coinsEarned} oofcoins.`
                      );

                    db.run(
                      'UPDATE currency SET bank = bank + ? WHERE user = ?',
                      [coinsEarned, user.id],
                      (err) => {
                        if (err) {
                          console.log(err);
                          message.channel.send('Error trying to adjust your coin value!');
                        }
                      }
                    );
                  });
                })
                .catch((err) => {
                  var lost = 0;
                  switch (difficulty) {
                    case 'Easy':
                      lost = 1;
                      break;
                    case 'Medium':
                      lost = 3;
                      break;
                    case 'Hard':
                      lost = 4;
                      break;
                  }
                  db.run(
                    'UPDATE currency SET bank = bank - ? WHERE user = ?',
                    [lost, user.id],
                    (err) => {
                      console.error(err);
                    }
                  );
                  return message.channel.send(
                    `<@${user.id}>, you ran out of time! The answer to \`${entities.decode(
                      answers.question
                    )}\` is \`${answers.correct_answer}\`. ` + `You lost ${lost} oofcoins.`
                  );
                });
            })
            .catch(function () {
              console.error('error');
            });
        }
      });
  }
};

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
*/
