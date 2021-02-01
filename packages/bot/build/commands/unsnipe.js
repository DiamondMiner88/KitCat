"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("../commands");
const db_1 = require("../db");
const utils_1 = require("../util/utils");
const snipe_1 = require("./snipe");
class Snipe extends commands_1.Command {
    constructor() {
        super(...arguments);
        this.trigger = 'unsnipe';
        this.category = commands_1.Categories.UTIL;
        this.name = '︻デ═一 Unsnipe';
        this.description = "Prevent your deleted message from being sniped. This does not delete a message already sniped. Contact your server's moderators.";
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
        const msg = snipe_1.snipeCache.get(message.channel.id);
        if (!msg)
            return message.reply('I could not find the most recently deleted message!');
        if (msg.authorId !== message.author.id)
            return message.reply("The deleted message wasn't sent by you so I cannot unsnipe it");
        snipe_1.snipeCache.del(message.channel.id);
        message.reply('Done.');
    }
}
exports.default = Snipe;
