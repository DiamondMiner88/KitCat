"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesData = exports.Categories = exports.Command = void 0;
const util_1 = require("util");
const logging_1 = require("./util/logging");
class Command {
    constructor() {
        this.guildOnly = true;
        this.unlisted = false;
        this.nsfw = false;
        this.log = (level, message) => logging_1.logger.log(level, `[${this.trigger}] %s`, typeof message === 'string' ? message : util_1.inspect(message, { depth: Infinity, colors: true }));
    }
    get formattedUsage() {
        return `\`/${this.trigger}${this.usage != null ? ' ' + this.usage : ''}\``;
    }
}
exports.Command = Command;
var Categories;
(function (Categories) {
    Categories[Categories["MODERATION"] = 0] = "MODERATION";
    Categories[Categories["FUN"] = 1] = "FUN";
    Categories[Categories["UTIL"] = 2] = "UTIL";
    Categories[Categories["KITCAT"] = 3] = "KITCAT";
})(Categories = exports.Categories || (exports.Categories = {}));
exports.CategoriesData = [
    {
        name: '🚫 Moderation',
        description: 'Commands to help keep your server in shape!',
    },
    {
        name: '😄 Fun',
        description: 'Random, stupid and fun commands!',
    },
    {
        name: '🛠️ Utils',
        description: 'Utility commands that may or may not be helpful!',
    },
    {
        name: 'KitCat',
        description: 'Commands related to me!',
    },
];
