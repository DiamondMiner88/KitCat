"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
exports.logger = winston_1.createLogger({
    transports: [
        new winston_1.transports.Console({
            level: 'info',
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
        }),
    ],
});
exports.logger.debug('Logger has initialized');
