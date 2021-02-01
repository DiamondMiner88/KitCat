"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGuildSettings = exports.cachedSettings = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const node_cache_1 = __importDefault(require("node-cache"));
const utils_1 = require("./util/utils");
exports.prisma = new client_1.PrismaClient();
exports.cachedSettings = new node_cache_1.default();
async function getGuildSettings(guild) {
    let settings = exports.cachedSettings.get(guild.id);
    if (settings)
        return settings;
    let fetched = await exports.prisma.guildSettings.findFirst({ where: { id: guild.id } });
    if (!fetched) {
        fetched = await exports.prisma.guildSettings.create({
            data: {
                id: guild.id,
            },
        });
    }
    exports.cachedSettings.set(guild.id, fetched, utils_1.clamp((guild.memberCount / 5) * 60, 300, 7200));
    return fetched;
}
exports.getGuildSettings = getGuildSettings;
