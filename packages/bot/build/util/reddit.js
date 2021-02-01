"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopPost = void 0;
const discord_js_1 = __importStar(require("discord.js"));
const snoowrap_1 = __importDefault(require("snoowrap"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const reddit = new snoowrap_1.default({
    userAgent: 'meme_gatherer',
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
});
const guild_id_list = new discord_js_1.Collection();
const dm_id_list = new discord_js_1.Collection();
let idlist_last_cleared = new Date().getTime();
async function getTopPost(message, subreddit_name) {
    if (new Date().getTime() - 43200000 >= idlist_last_cleared) {
        idlist_last_cleared = new Date().getTime();
        guild_id_list.clear();
        dm_id_list.clear();
    }
    if (message.channel.type !== 'dm') {
        const res = await node_fetch_1.default(`https://api.reddit.com/r/${subreddit_name}/about`);
        const resJSON = await res.json();
        if (resJSON.data.over18 && !message.channel.nsfw)
            return message.channel.send('The subreddit you chose is 18+. Run this command in a NSFW channel to get the posts.');
        else {
            const list = guild_id_list.get(message.guild.id) || [];
            const subreddit = reddit.getSubreddit(subreddit_name);
            const topPosts = await subreddit.getTop({
                limit: 100,
                after: list[list.length - 1],
            });
            let postToUse;
            topPosts.forEach(post => {
                if (!list.some(id => id === post.id)) {
                    postToUse = post;
                }
            });
            if (!postToUse)
                return message.channel.send(`That subreddit doesn't exist!`);
            list.push(postToUse.id);
            guild_id_list.set(message.guild.id, list);
            if (postToUse.over_18 && !message.channel.nsfw)
                return message.channel.send(`Post was enexpectedly NSFW. Execute this command again to get another post!`);
            sendPost(message, postToUse);
        }
    }
    else {
        const list = dm_id_list.get(message.author.id) || [];
        const subreddit = reddit.getSubreddit(subreddit_name);
        const topPosts = await subreddit.getTop({
            limit: 100,
            after: list[list.length - 1],
        });
        let postToUse;
        topPosts.forEach(post => {
            if (!list.some(id => id === post.id)) {
                postToUse = post;
            }
        });
        if (!postToUse)
            return message.channel.send(`That subreddit doesn't exist!`);
        list.push(postToUse.id);
        dm_id_list.set(message.author.id, list);
        sendPost(message, postToUse);
    }
}
exports.getTopPost = getTopPost;
function sendPost(message, post) {
    const embed = new discord_js_1.default.MessageEmbed()
        .setColor(0xf9f5ea)
        .setAuthor(`u/${post.author.name}`)
        .setTitle(post.title)
        .setURL(`https://reddit.com${post.permalink}`)
        .setImage(post.url)
        .setFooter(`👍 ${scoreToText(post.score)}`)
        .setTimestamp(new Date(post.created_utc * 1000));
    message.channel.send(embed);
}
function scoreToText(score) {
    let text;
    if (score < 1000)
        text = score.toString();
    else {
        text = (Math.round(score / 100) * 100).toString().slice(0, -2);
        text = insertAt(text, -1, 0, '.');
        text += 'k';
    }
    return text;
}
function insertAt(baseStr, idx, rem, str) {
    return baseStr.slice(0, idx) + str + baseStr.slice(idx + Math.abs(rem));
}
