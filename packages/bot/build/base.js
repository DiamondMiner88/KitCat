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
exports.KClient = void 0;
const discord_js_1 = require("discord.js");
const glob_1 = __importDefault(require("glob"));
const logging_1 = require("./util/logging");
class KClient extends discord_js_1.Client {
    constructor(options = {}) {
        super(options);
        this.commands = [];
        glob_1.default(`${__dirname}/commands/*.js`, (err, matches) => {
            if (err)
                logging_1.logger.error(`Error trying to get a list of available commands: ${err?.message}`);
            matches.forEach(async (file) => this.commands.push(new (await Promise.resolve().then(() => __importStar(require(file)))).default()));
        });
    }
}
exports.KClient = KClient;
