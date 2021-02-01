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
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefix = exports.client = void 0;
const logging_1 = require("./util/logging");
const base_1 = require("./base");
const utils_1 = require("./util/utils");
const db_1 = require("./db");
const snipe_1 = require("./commands/snipe");
const reactionroles = __importStar(require("./commands/reactionroles"));
exports.client = new base_1.KClient({ partials: ['REACTION', 'MESSAGE'] });
process.on('SIGTERM', () => {
    exports.client.destroy();
    db_1.prisma.$disconnect();
    logging_1.logger.info('Gracefully exiting.');
    process.exit(0);
});
exports.client.on('ready', async () => {
    logging_1.logger.info(`Logged in as ${exports.client.user.tag} (${exports.client.user.id}) | In ${exports.client.guilds.cache.size} guilds.`);
    logging_1.logger.info(`Invite: ${await exports.client.generateInvite({ permissions: 8 })}`);
    const updateStatus = () => exports.client.user.setActivity(`In ${exports.client.guilds.cache.size} servers`);
    updateStatus();
    setInterval(updateStatus, 30 * 60 * 1000);
});
exports.client.on('guildMemberAdd', async (member) => {
    const { joinMessage } = await db_1.getGuildSettings(member.guild);
    if (joinMessage)
        member.user.send(joinMessage).catch(utils_1.NOOP);
});
exports.client.on('messageReactionAdd', reactionroles.onMessageReactionAdd);
exports.client.on('messageReactionRemove', reactionroles.onMessageReactionRemove);
exports.client.on('message', snipe_1.addMessageToSnipeCache);
exports.prefix = 'k!';
exports.client.on('message', async (message) => {
    try {
        await message.fetch();
        if (message.author.bot)
            return;
    }
    catch (error) {
        return;
    }
    if (message.mentions.has(exports.client.user, { ignoreRoles: true, ignoreEveryone: true }) &&
        !message.toString().toLowerCase().includes(exports.prefix.toLowerCase()))
        return message.channel.send(`Do ${exports.prefix}help for commands!`);
    if (!message.content.toLowerCase().startsWith(exports.prefix.toLowerCase()))
        return;
    const args = message.content.slice(exports.prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = exports.client.commands.find(c => c.trigger === commandName);
    if (!command)
        return;
    if (command.guildOnly && message.channel.type !== 'text')
        return message.channel.send('This command only works in Guild Text Channels!');
    if (message.channel.type !== 'dm' && command.nsfw === true && !message.channel.nsfw)
        return message.channel.send('NSFW commands can only be run in NSFW channels');
    if (message.channel.type === 'dm')
        return command.invoke(message, args);
    return command.invoke(message, args);
});
exports.client.login().catch(e => {
    logging_1.logger.error(`Could not login because of: ${e.message} Exiting...`);
    process.exit(1);
});
