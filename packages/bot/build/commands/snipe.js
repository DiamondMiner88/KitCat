"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessageToSnipeCache = exports.StoredMessage = exports.snipeCache = void 0;
const discord_js_1 = require("discord.js");
const node_cache_1 = __importDefault(require("node-cache"));
const commands_1 = require("../commands");
const db_1 = require("../db");
const utils_1 = require("../util/utils");
exports.snipeCache = new node_cache_1.default();
class StoredMessage {
    constructor(message) {
        this.content = message.content;
        this.avatarURL = message.author.displayAvatarURL({ format: 'png', dynamic: true });
        this.tag = message.author.tag;
        this.createdAt = message.createdAt;
        this.authorId = message.author.id;
    }
}
exports.StoredMessage = StoredMessage;
class Snipe extends commands_1.Command {
    constructor() {
        super(...arguments);
        this.trigger = 'snipe';
        this.category = commands_1.Categories.UTIL;
        this.name = '︻デ═一 Snipe';
        this.description = 'Bring back the most recently deleted message.';
        this.usage = '';
        this.guildOnly = true;
        this.unlisted = false;
        this.nsfw = false;
    }
    async invoke(message) {
        const settings = await db_1.getGuildSettings(message.guild);
        if (!settings.snipingEnabled) {
            if (utils_1.hasPermission(message.member))
                return message.reply('Sniping is disabled for this server! You can enable it on the dashboard! `/dashboard`');
            else
                return message.reply('Sorry, but sniping is disabled on this server!');
        }
        const msg = exports.snipeCache.get(message.channel.id);
        if (!msg)
            return message.reply('I could not find the most recently deleted message!');
        message.reply(new discord_js_1.MessageEmbed().setAuthor(msg.tag, msg.avatarURL).setDescription(msg.content).setTimestamp(msg.createdAt));
    }
}
exports.default = Snipe;
function addMessageToSnipeCache(message) {
    if (!message.guild)
        return;
    exports.snipeCache.set(message.channel.id, new StoredMessage(message), 21600);
}
exports.addMessageToSnipeCache = addMessageToSnipeCache;
