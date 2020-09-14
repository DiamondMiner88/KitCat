import { configure, getLogger } from 'log4js';
import format from 'dateformat';

export function initLogger() {
  const startTime = format(new Date(), 'yyyy-mm-dd.HH-MM-ss');

  configure({
    appenders: {
      all: {
        type: 'file',
        filename: `../logs/${startTime}-latest.log`,
        maxLogSize: 20971520, //20 MB
        layout: { type: 'pattern', pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c - %m' },
        compress: true
      },
      terminal: {
        type: 'stdout',
        layout: { type: 'pattern', pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] %[[%p] %c -%] %m' }
      }
    },
    categories: {
      default: { appenders: ['all', 'terminal'], level: 'DEBUG' }
    }
  });

  getLogger('logging.ts').debug('Initialized logger.');
}
