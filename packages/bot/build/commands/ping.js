"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("../commands");
class Ping extends commands_1.Command {
    constructor() {
        super(...arguments);
        this.trigger = 'ping';
        this.category = commands_1.Categories.KITCAT;
        this.name = `Ping`;
        this.description = `Gets my latency.`;
        this.usage = '';
        this.guildOnly = false;
        this.unlisted = false;
        this.nsfw = false;
    }
    async invoke(message) {
        const m = await message.channel.send('Not happening.');
        setTimeout(() => m.edit(`Pong! Round trip latency is ${m.createdTimestamp - message.createdTimestamp}ms. Heartbeat is ${Math.round(message.client.ws.ping)}ms`), 5000);
    }
}
exports.default = Ping;
