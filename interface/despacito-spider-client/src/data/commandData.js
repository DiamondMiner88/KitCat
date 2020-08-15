// DO NOT BEAUTIFY/PRETTIER THIS FILE
// MAKE SURE IT IS IN THE SAME FORMAT AS IT IS RIGHT NOW
// This is to prevent Git line commit inflation

module.exports = {"commands":[{"command":"2048","help_name":"🔢 2048","help_description":"Play 2048 in Discord","usage":"2048 help","guildOnly":true},{"command":"8ball","help_name":"🎱 8Ball","help_description":"Ask it a question, and it will give you an answer.","usage":"8ball {Your Question}","guildOnly":false},{"command":"avatar","help_name":"Avatar","help_description":"Get avatar of the user after the command. Can be a mention or a tag.","usage":"avatar {mention | user tag}","guildOnly":false},{"command":"balance","help_name":"Oof coin Balance","help_description":"Gets the your or the mention user's global balance of oof coin.","usage":"balance {optional: mention | username#discriminator}","guildOnly":false},{"command":"ban","help_name":"⛔ Ban","help_description":"Used to ban members.","usage":"ban {mention | username#discriminator} {optional: reason}","guildOnly":true},{"command":"blacklist","help_name":"Blacklist commands","help_description":"For more commands on the blacklist do","usage":"blacklist help","guildOnly":true},{"command":"doggo","help_name":"🐶 Doggo","help_description":"Get a photo of a doggo using this command!","usage":"doggo {optional: breed | example: retriever}","guildOnly":false},{"command":"help","help_name":"Help","help_description":"What you're looking at right now.","usage":"help","guildOnly":false},{"command":"image","help_name":"📷 Photo Commands","help_description":"Run photo commands to make custom photos.","usage":"image help","guildOnly":false},{"command":"kick","help_name":":leg: Kick","help_description":"Used to kick members.","usage":"kick {mention | username#discriminator} {optional: reason}","guildOnly":true},{"command":"meme","help_name":"😂 Memes","help_description":"Get a meme from r/memes","usage":"meme","guildOnly":false},{"command":"nhentai","help_name":"nHentai","help_description":"Gives an overview of the nHentai code.","usage":"nhentai {number} ` or `{number}","guildOnly":false},{"command":"nsfw","help_name":"😏 NSFW","help_description":"Get NSFW photos, and gifs.","usage":"nsfw help","guildOnly":false},{"command":"ping","help_name":"Ping","help_description":"Gets my latency and API latency.","usage":"ping","guildOnly":false},{"command":"purge","help_name":"🗑️ Purge","help_description":"Used to delete messages in bulk.","usage":"purge {amount: default = 5}","guildOnly":true},{"command":"purgechannel","help_name":"🗑️ Purge Channel","help_description":"Used to delete to wipe all messages in a channel. ***This command deletes and makes a new channel in the exact same spot***","usage":"purgechannel","guildOnly":true},{"command":"quote","help_name":"😇 Inspirational Quote","help_description":"Gives an inspirational quote!","usage":"quote","guildOnly":false},{"command":"say","help_name":":speaking_head: Say","help_description":"Make the bot say whatever you want!","usage":"say {message}","guildOnly":false},{"command":"sban","help_name":"⛔ Silent ban","help_description":"Used to silently ban members.","usage":"sban {mention | username#discriminator} {optional: reason}","guildOnly":true},{"command":"server","help_name":"Server","help_description":"Gives information on the server. Information: Server size (with and without bots), and the date server was created.","usage":"server","guildOnly":false},{"command":"skick","help_name":":leg: Silent kick","help_description":"Used to silently kick members.","usage":"skick {mention | username#discriminator} {optional: reason}","guildOnly":true},{"command":"subreddit","help_name":"🌐 Subreddit","help_description":"Get a top post from a subreddit! (NSFW subreddits allowed in NSFW channels)","usage":"subreddit {Subreddit name}","guildOnly":false},{"command":"trivia","help_name":"❓ Trivia","help_description":"Asks a trivia question!. If you get the question right, you earn oof coins, if you get it wrong, you loose oofcoins.\nRun `-trivia help` for help with the trivia command.","usage":"trivia {optional: difficulty} {optional: category}","guildOnly":false},{"command":"tts","help_name":":robot: TTS","help_description":"Joins VC and says what you want it to say!","usage":"tts {text}","guildOnly":true},{"command":"warn","help_name":"⚠️ Warn","help_description":"Warn a user.","usage":"warn {mention | username#discriminator} {reason}","guildOnly":false}],"categories":[{"help_name":"🚫 Moderation","help_description":"","usage":"`-help moderation`","commands":["ban","blacklist","kick","purge","purgechannel","sban","skick","warn"]},{"help_name":"😄 Fun","help_description":"","usage":"`-help fun`","commands":["8ball","doggo","image","meme","nsfw","quote","say","subreddit","trivia"]},{"help_name":":tools: Utils","help_description":"","usage":"`-help utils`","commands":["avatar","help","nhentai","ping","server","tts"]},{"help_name":"💰 Oof coin","help_description":"","usage":"`-help oofcoin`","commands":["balance"]},{"help_name":"🎲 Games","help_description":"","usage":"`-help games`","commands":["2048"]}]}