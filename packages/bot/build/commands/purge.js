"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const commands_1 = require("../commands");
const utils_1 = require("../util/utils");
const utils_2 = require("../util/utils");
class Purge extends commands_1.Command {
    constructor() {
        super(...arguments);
        this.trigger = 'purge';
        this.category = commands_1.Categories.MODERATION;
        this.name = '🗑️ Purge';
        this.description = `Used to delete messages in bulk.`;
        this.usage = '[amount = 10]';
        this.guildOnly = true;
        this.unlisted = false;
        this.nsfw = false;
    }
    invoke(message, args) {
        if (!utils_2.hasPermission(message.member, discord_js_1.Permissions.FLAGS.MANAGE_MESSAGES))
            return message.channel.send('You do not have the permission to manage messages.');
        let purgeamnt = 10;
        if (!isNaN(Number(args[0])))
            purgeamnt = Number(args[0]);
        if (purgeamnt > 100) {
            message.channel.send(`The purging limit is 100`);
        }
        else {
            message.channel
                .bulkDelete(purgeamnt)
                .then((messages) => {
                message.channel.send(`Purged ${messages.size} messages, deleting this in 2 seconds.`).then(msg => {
                    setTimeout(() => msg.delete().catch(utils_1.NOOP), 2000);
                });
            })
                .catch((err) => message.channel.send(err.message));
        }
    }
}
exports.default = Purge;
