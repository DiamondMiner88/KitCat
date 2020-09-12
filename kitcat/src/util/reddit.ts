import Discord, { Collection } from 'discord.js';
import snoowrap, { Submission } from 'snoowrap';
import fetch from 'node-fetch';

const reddit = process.env.REDDIT_CLIENT_ID
  ? new snoowrap({
      userAgent: 'meme_gatherer',
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD
    })
  : undefined;

const guild_id_list: Collection<Discord.Snowflake, string[]> = new Collection();
const dm_id_list: Collection<Discord.Snowflake, string[]> = new Collection();
var idlist_last_cleared = new Date().getTime();

export async function getTopPost(message: Discord.Message, subreddit_name: string) {
  // Reset list if its been 12 hrs
  // Change this later because it will reset in the middle of usage
  if (new Date().getTime() - 43200000 >= idlist_last_cleared) {
    idlist_last_cleared = new Date().getTime();
    guild_id_list.clear();
    dm_id_list.clear();
  }

  if (message.channel.type !== 'dm') {
    const res = await fetch(`https://api.reddit.com/r/${subreddit_name}/about`);
    const resJSON = await res.json();
    if (resJSON.data.over18 && !message.channel.nsfw)
      return message.channel.send(
        'The subreddit you chose is 18+. Run this command in a NSFW channel to get the posts.'
      );
    else {
      const list: string[] = guild_id_list.get(message.guild.id) || [];

      const subreddit = reddit.getSubreddit(subreddit_name);
      const topPosts = await subreddit.getTop({
        limit: 100,
        after: list[list.length - 1]
      });

      let postToUse: Submission;

      topPosts.forEach((post) => {
        if (!list.some((id) => id === post.id)) {
          postToUse = post;
        }
      });

      if (!postToUse) return message.channel.send(`That subreddit doesn't exist!`);

      list.push(postToUse.id);

      guild_id_list.set(message.guild.id, list);

      if (postToUse.over_18 && !message.channel.nsfw)
        return message.channel.send(
          `Post was enexpectedly NSFW. Execute this command again to get another post!`
        );

      sendPost(message, postToUse);
    }
  } else {
    const list: string[] = dm_id_list.get(message.author.id) || [];

    const subreddit = reddit.getSubreddit(subreddit_name);
    const topPosts = await subreddit.getTop({
      limit: 100,
      after: list[list.length - 1]
    });

    let postToUse: Submission;

    topPosts.forEach((post) => {
      if (!list.some((id) => id === post.id)) {
        postToUse = post;
      }
    });

    if (!postToUse) return message.channel.send(`That subreddit doesn't exist!`);

    list.push(postToUse.id);

    dm_id_list.set(message.author.id, list);

    sendPost(message, postToUse);
  }
}

function sendPost(message: Discord.Message, post: Submission) {
  let embed = new Discord.MessageEmbed()
    .setColor(0xf9f5ea)
    .setAuthor(`u/${post.author.name}`)
    .setTitle(post.title)
    .setURL(`https://reddit.com${post.permalink}`)
    .setImage(post.url)
    .setFooter(`👍 ${scoreToText(post.score)}`)
    .setTimestamp(new Date(post.created_utc * 1000));
  message.channel.send(embed);
}

function scoreToText(score: number) {
  let text: string;
  if (score < 1000) text = score.toString();
  else {
    text = (Math.round(score / 100) * 100).toString().slice(0, -2);
    text = insertAt(text, -1, 0, '.');
    text += 'k';
  }
  return text;
}

function insertAt(baseStr: string, idx: number, rem: number, str: string) {
  return baseStr.slice(0, idx) + str + baseStr.slice(idx + Math.abs(rem));
}
