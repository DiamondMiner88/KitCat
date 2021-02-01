"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const commands_1 = require("../commands");
const utils_1 = require("../util/utils");
class PurgeChannel extends commands_1.Command {
    constructor() {
        super(...arguments);
        this.trigger = 'purgechannel';
        this.category = commands_1.Categories.MODERATION;
        this.name = `🗑️ Purge Channel`;
        this.description = `Used to delete to wipe all messages in a channel. Sometimes is buggy. **This command deletes and makes a new channel.**`;
        this.usage = '';
        this.guildOnly = true;
        this.unlisted = false;
        this.nsfw = false;
    }
    async invoke(message) {
        message.channel = message.channel;
        if (!utils_1.hasPermission(message.member, discord_js_1.Permissions.FLAGS.MANAGE_MESSAGES))
            return message.channel.send('You do not have to do that!');
        if (!message.channel.deletable)
            return message.channel.send(`I don't have permission to delete this channel!`);
        const { rawPosition } = message.channel;
        let newChnl;
        try {
            newChnl = await message.channel.clone();
        }
        catch (error) {
            message.channel.send('Error cloning this channel!\n' + error);
        }
        message.channel
            .delete()
            .then(() => {
            newChnl.setPosition(rawPosition);
        })
            .catch(err => message.channel.send('Error deleting this channel!\n' + err.message));
    }
}
exports.default = PurgeChannel;
