//https://discordapp.com/oauth2/authorize?&client_id=713778178967076945&scope=bot&permissions=8
const Discord = require("discord.js");
const fs = require('fs');
const snoowrap = require('snoowrap');
const fetch = require("node-fetch");
const config = require("./config.json");
const blackListImageHash = require("./image-hash-blacklist.json")
const {
  imageHash
} = require('image-hash');

const client = new Discord.Client();
const pfx = config.prefix;
const reddit = new snoowrap({
  userAgent: config.reddit_user_agent,
  clientId: config.reddit_client_id,
  clientSecret: config.reddit_client_secret,
  username: config.reddit_username,
  password: config.reddit_password,
});

// Run on exit
if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function() {
    process.emit("SIGINT");
  });
}
process.on("SIGINT", function() {
  console.log(`Exiting...`);
  client.destroy();
  process.exit();
});

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.cache.array().length} users, in ${client.channels.cache.array().length} channels of ${client.guilds.cache.array().length} guilds.`);
  client.user.setActivity(`${pfx}help`)
});

client.on("guildMemberRemove", member => {
  channel = member.guild.channels.find(channel => channel.name === 'general');
  channel.send(`\`${member.user.tag}\` has left the server.`);
});

client.on("message", async message => {
  testBlacklistImage(message);
  if (message.author.bot) return;

  let redditThreadRegex = /https?:\/\/www.reddit.com\/r\/.+?(?=\/)\/comments\/.+?(?=\/)\/.+/g;
  if (message.content.match(redditThreadRegex)) {
    // TODO: connect to reddit, get the thread from url and post the content on discord
  }

  var weebAliases = ['weeb', 'weeabo', 'wee b', 'w e e b', 'w eeb', 'weeab o', 'we_eb', 'weeeb', 'weeeeb', 'w_eeb', 'w e eb', 'wee  b', 'weebs'];
  for (var index = 0; index < weebAliases.length; index++) {
    if (message.content.toLowerCase().includes(weebAliases[index])) {
      message.delete();
      return;
    }
  }

  if (message.content.indexOf(pfx) !== 0) return; // Skip any messages that dont include the prefix at the front

  const args = message.content.slice(pfx.length).trim().split(/ +/g); // args is an array of text after the command that were seperated by a whitespace
  const command = args.shift().toLowerCase(); // command is the word after the prefix

  if (command === "ping") {
    // Calculates ping between sending a message and editing it, giving a round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  else if (command === "help") {
    if (args[0] === undefined) {
      message.channel.send({
        embed: {
          color: 0x0099ff,
          title: 'Command List',
          fields: [{
              name: `:tools: Moderation`,
              value: `Used for moderating the server!\n\`${pfx}help moderation\``
            },
            {
              name: `:smile: Fun`,
              value: `'Fun' commands\n\`${pfx}help fun\``
            }
          ],
          timestamp: new Date(),
          footer: {
            text: `${message.author.tag} Executed: \`${message.content}\``,
            icon_url: message.author.avatarURL
          }
        }
      });
    }
    else if (args[0].toLowerCase() === "moderation") {
      message.channel.send({
        embed: {
          color: 0x0099ff,
          title: ':tools: Moderation Commands',
          fields: [{
              name: `:wastebasket: Purge`,
              value: `Used to delete messages\n\`${pfx}purge {amount: default = ${config.default_purge_amnt}}\``
            },
            {
              name: `:warning: Warn`,
              value: `Used to warn people.\n\`${pfx}warn {member} {reason}\` **WIP**`
            },
            {
              name: `:leg: Kick`,
              value: `Used to kick members.\n\`${pfx}kick {member} {optional: reason}\` **WIP**`
            },
            {
              name: `:no_entry_sign: Ban`,
              value: `Used to ban members.\n\`${pfx}ban {member} {optional: reason}\` **WIP**`
            },
            {
              name: `:arrows_counterclockwise: Unban`,
              value: `Used to unban banned users.\n\`${pfx}unban {user}\` **WIP**`
            },
          ],
          timestamp: new Date(),
          footer: {
            text: `${message.author.tag} Executed: \`${message.content}\``,
            icon_url: message.author.avatarURL
          }
        }
      });
    }
    else if (args[0].toLowerCase() === "fun") {
      message.channel.send({
        embed: {
          color: 0x0099ff,
          title: ':smile: Fun',
          fields: [{
              name: `:8ball: 8Ball`,
              value: `Ask it a question, and it will give you an answer.\n\`${pfx}8ball {question}\``
            },
            {
              name: `:joy: Memes`,
              value: `Get memes from r/memes\n\`${pfx}meme\``
            },
            {
              name: `:globe_with_meridians: Subreddit`,
              value: `Get posts from a subreddit! (NSFW subreddits allowed in NSFW channels)\n\`${pfx}subreddit {subreddit}\``
            },
            {
              name: `:innocent: Inspirational Quote`,
              value: `Gives an inspirational quote!\n\`${pfx}quote\``
            }
          ],
          timestamp: new Date(),
          footer: {
            text: `${message.author.tag} Executed: \`${message.content}\``,
            icon_url: message.author.avatarURL
          }
        }
      });
    }
  }
  else if (command === "8ball") {
    if (args !== undefined) {
      message.channel.send(`Question: ${args.join(" ")}\nAnswer: ${config.eight_ball_replies[Math.floor(Math.random()*config.eight_ball_replies.length)]}`);
    }
    else {
      message.channel.send(`You didn't ask a question`);
    }
  }
  else if (command === "quote") {
    // https://github.com/lukePeavey/quotable#readme
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    message.channel.send(`"${data.content}"\n- ${data.author}`);
  }
  else if (command === "purge") {
    purgeamnt = config.default_purge_amnt;
    if (!isNaN(args[0])) purgeamnt = Number(args[0]);
    if (purgeamnt > 100) {
      message.channel.send(`The purging limit is 100`);
    }
    else {
      let tmpPurgeMsg;
      message.channel.bulkDelete(purgeamnt)
        .then((messages) => {
          tmpPurgeMsg = `Purged ${messages.size} messages`;
          message.channel.send(tmpPurgeMsg)
          .then(msg => msg.delete({
            timeout: 10000
          }));
        })
        .catch(console.error);
    }
  }
  else if (command === 'avatar') {
    if (args[0] === undefined) {
      message.channel.send(`You need to mention someone or put their username#discriminator`);
      return;
    }
    let target_user = message.mentions.users.first();
    if (!target_user) {
      let matching_users = client.users.cache.filter(user => user.username === args[0].split("#")[0]);
      target_user = matching_users.find(user => user.discriminator === args[0].split("#")[1]);
      if (!target_user) {
        message.channel.send('Member not found');
        return;
      }
    }
    message.channel.send({
      embed: {
        color: 0x0099ff,
        title: 'Avatar',
        fields: [{
          name: `${target_user.tag}'s Avatar`,
          value: target_user.avatarURL({
            format: "png"
          })
        }],
        image: {
          url: target_user.avatarURL({
            format: "png"
          })
        },
        timestamp: new Date(),
        footer: {
          text: `${message.author.tag} Executed: \`${message.content}\``,
          icon_url: message.author.avatarURL
        }
      }
    });
  }
  else if (command === "meme") {
    getTopPost(message, config.memes_subreddit);
  }
  else if (command === "subreddit") {
    if (args[0] === undefined) {
      message.channel.send(`Missing subreddit`);
      return;
    }
    getTopPost(message, args[0]);
  }
});

async function testBlacklistImage(message) {
  let url = undefined;
  if (message.attachments.size > 0) {
    url = message.attachments.first().url;
  }
  regex = /http?s:\/\/cdn\.discordapp\.com\/attachments\/.+?(?=\/)\/.+?(?=\/)\/.+/g;
  if (message.content.match(regex)) {
    url = message.content;
  }
  if (url !== undefined) {
    if (url.toLowerCase().indexOf("jpg", url.length - 3) !== -1) {
      imageHash(url, 16, true, (error, hash) => {
        if (error) throw error;
        console.log(hash + " " + url);
        if (blackListImageHash.includes(hash)) {
          message.delete();
        }
      });
    }
    if (url.toLowerCase().indexOf("png", url.length - 3) !== -1) {
      imageHash(url, 16, true, (error, hash) => {
        if (error) throw error;
        console.log(hash + " " + url);
        if (blackListImageHash.includes(hash)) {
          message.delete();
        }
      });
    }
  }
}

var reddit_submission_ids = [];
var reddit_idlist_starttime = new Date().getTime();
async function getTopPost(message, subreddit_name) {
  // reset id list if its been a day
  // id list is to prevent returning the same post
  if (new Date().getTime() - 86400000 >= reddit_idlist_starttime) {
    reddit_idlist_starttime = new Date().getTime();
    reddit_submission_ids = [];
  }

  let subreddit = await reddit.getSubreddit(subreddit_name);
  let topPosts = await subreddit.getTop({
    limit: 100
  });
  let postToUse;
  for (submission in topPosts) {
    if (!reddit_submission_ids.includes(topPosts[submission].id)) {
      postToUse = topPosts[submission];
      reddit_submission_ids.push(postToUse.id);
      break;
    }
  }
  // if (postToUse.subreddit.over_18 && !message.channel.nsfw) {
  //   message.channel.send(`The subreddit is NSFW. Run this command in a NSFW channel to get the post.`);
  // }
  // else if (postToUse.over_18 && !message.channel.nsfw) {
  //   message.channel.send(`The post was NSFW while this channel is not. Getting a new post, hold on...`);
  //   getTopPost(message, subreddit_name);
  // }
  // else {
  //   embed = new Discord.MessageEmbed();
  //   embed.setColor("white");
  //   console.log(postToUse);
  //   // message.channel.send(embed);
  //   // message.channel.send(`<https://reddit.com${postToUse.permalink}>\n${postToUse.url}`);
  // }
  let embed = new Discord.MessageEmbed()
    .setColor("white")
    .setAuthor(`u/${postToUse.author.name}`)
    .setTitle(postToUse.title)
    .setURL(`https://reddit.com${postToUse.permalink}`)
    .setImage(postToUse.url)
    .setFooter(`👍 ${postToUse.score} `)
    .setTimestamp(new Date(postToUse.created_utc * 1000));
  message.channel.send(embed);
  // message.channel.send(`<https://reddit.com${postToUse.permalink}>\n${postToUse.url}`);
}

client.login(config.token);
