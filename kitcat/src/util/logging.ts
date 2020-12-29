import { configure, getLogger } from 'log4js';
import format from 'dateformat';

export function initLogger(): void {
    const startTime = format(new Date(), 'yyyy-mm-dd.HH-MM-ss');

    configure({
        appenders: {
            all: {
                type: 'file',
                filename: `../logs/${startTime}-latest.log`,
                layout: { type: 'pattern', pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] %c - %m' },
                compress: true,
            },
            terminal: {
                type: 'stdout',
                layout: { type: 'pattern', pattern: '[%d{yyyy-MM-dd hh:mm:ss}] %[[%p] %c -%] %m' },
            },
        },
        categories: {
            default: { appenders: ['all', 'terminal'], level: 'DEBUG' },
        },
    });

    getLogger('logging.ts').debug('Initialized logger.');
}
