import log4js from 'log4js';
import format from 'dateformat';

const startTime = format(new Date(), 'yyyy-mm-dd.HH-MM-ss');

log4js.configure({
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

export const DEFAULT_LOGGER = log4js.getLogger();
export const getLogger = (category?: string) => log4js.getLogger(category);
export const shutdownLogger = () => log4js.shutdown();
