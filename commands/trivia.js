const config = require("../config.json");
const pfx = config.prefix;
const Discord = require('discord.js');
const fetch = require('node-fetch');

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
    .addField('Ussage', `\`\`${pfx}trivia \`{amount}\` \`{category}\` \`{difficulty}\` \`{type}\` \`\``)
;

module.exports = {
    command: "trivia",
    category: "fun",
    help_name: `:question: Trivia`, 
    help_description: `Asks a trivia question!\n\`\`${pfx}trivia \`{amount}\` \`{category}\` \`{difficulty}\` \`{type}\` \`\`.\nRun \`${pfx}trivia help\` for help with the trivia command.`, 
    execute(client, message, args) {
        if (args[0] === "help") {      
            return message.channel.send(triviaHelp);
        }
        var input = args.join(' ').split('`').filter(function(str) {
            return /\S/.test(str);
        });
        // if (input.length < 3) return message.channel.send("You didn't provide valid paramaters.");
        var amount = parseInt(input[0]);
        if (amount === NaN) return message.channel.send("You provided number count!");
        // console.log(input[1].toLowerCase().replace(/\s+/g, ''));
        var category = categories[input[1].toLowerCase().replace(/\s+/g, '')];
        if (category === undefined) return message.channel.send("You provided invalid category!");
        var difficulty = input[2];
        if (difficulty.toLowerCase().replace(/\s+/g, '') != "anydifficulty" && difficulty.toLowerCase().replace(/\s+/g, '') != 'easy' && difficulty.toLowerCase().replace(/\s+/g, '') != 'medium' && difficulty.toLowerCase().replace(/\s+/g, '') != 'hard') {
            return message.channel.send("You provided an invalid difficulty!");
        }
        var toq = input[3];
        if (toq.toLowerCase().replace(/\s+/g, '') != 'multiplechoice' && toq.toLowerCase().replace(/\s+/g, '') != 'truefalse' && toq.toLowerCase().replace(/\s+/g, '') != 'anytype') {
            return message.channel.send("You provided an invalid type for the questions");
        }
        toq = selectedType[toq];
        difficulty = selectedDifficulty[difficulty];
    }
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
select
*/