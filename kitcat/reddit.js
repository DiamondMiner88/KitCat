const snoowrap = require('snoowrap');
const config = require('./config/config.json');
const pfx = config.prefix;

const reddit = new snoowrap({
  userAgent: config.reddit_user_agent,
  clientId: config.reddit_client_id,
  clientSecret: config.reddit_client_secret,
  username: config.reddit_username,
  password: config.reddit_password
});

var reddit_submission_ids = [];
var reddit_idlist_starttime = new Date().getTime();

/**
 * getTopPost - Gets the top post of a subreddit that has not been gotten yet for the guild
 *
 * @param  {Message} message Message this was executed from
 * @param  {String} subreddit_name subreddit name
 * @returns {void}
 */
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

  // if (postToUse.subreddit.over_18 === true && !message.channel.nsfw) {
  //   message.channel.send(`The subreddit you chose is NSFW. Run this command in a NSFW channel to get the post.`);
  // }
  // else if (postToUse.over_18 && !message.channel.nsfw) {
  //   message.channel.send(`The post was NSFW while this channel is not. Getting a new post, hold on...`);
  //   getTopPost(message, subreddit_name);
  // }
  postToUse.upvote();
  const Discord = require('discord.js');
  let embed = new Discord.MessageEmbed()
    .setColor('white')
    .setAuthor(`u/${postToUse.author.name}`)
    .setTitle(postToUse.title)
    .setURL(`https://reddit.com${postToUse.permalink}`)
    .setImage(postToUse.url)
    .setFooter(`👍 ${postToUse.score} `)
    .setTimestamp(new Date(postToUse.created_utc * 1000));
  message.channel.send(embed);
}

function linkImagesFromPosts(message) {
  let redditThreadRegex = /https?:\/\/www.reddit.com\/r\/.+?(?=\/)\/comments\/.+?(?=\/)\/.+/g;
  if (message.content.match(redditThreadRegex)) {
    // TODO: connect to reddit, get the thread from url and post the content on discord
  }
}

module.exports = {
  getTopPost,
  linkImagesFromPosts
};
