"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("../commands");
const db_1 = require("../db");
class EnableSnipe extends commands_1.Command {
    constructor() {
        super(...arguments);
        this.trigger = 'enablesnipe';
        this.category = commands_1.Categories.FUN;
        this.name = '';
        this.description = '';
        this.usage = '';
        this.guildOnly = true;
        this.unlisted = true;
        this.nsfw = false;
    }
    async invoke(message) {
        await db_1.prisma.guildSettings.upsert({
            create: {
                id: message.guild.id,
                snipingEnabled: true,
            },
            update: {
                snipingEnabled: true,
            },
            where: {
                id: message.guild.id,
            },
        });
        message.reply('Done.');
    }
}
exports.default = EnableSnipe;
