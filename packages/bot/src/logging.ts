import chalk, { Color } from 'chalk';
import dateFormat from 'dateformat';
import { TextChannel } from 'discord.js';
import { client } from '.';
import { NOOP, SNOWFLAKES } from './utils';

export class LoggerLevel {
  static readonly ERROR = new LoggerLevel(0, 'ERROR', 'redBright');
  static readonly WARNING = new LoggerLevel(1, 'WARNING', 'yellow');
  static readonly INFO = new LoggerLevel(2, 'INFO', 'green');
  static readonly DEBUG = new LoggerLevel(3, 'DEBUG', 'gray');

  private constructor(public level: number, public name: string, public color: typeof Color) {}
}

// TODO: make this dynamic
const djsPath = String.raw`D:\Programming\kitcat\packages\bot\node_modules.pnpm\github.com+discordjs+discord.js@99ff7151379fe03a1cfd52f252c0e6fc892d7776_72ef9f06cb99540da679cbf1bf7a3256\node_modules`;

export class Logger {
  constructor(public module: string) {}

  log(message: string, level: LoggerLevel): void {
    message = message.replace(djsPath, '');

    // prettier-ignore
    const str = chalk`{gray [${dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss.l')}]} {${level.color} [${level.name}]} {cyanBright [${this.module}]} - ${message}`;

    if (level.level === LoggerLevel.ERROR.level) console.error(str);
    else console.log(str);

    const channel =
      level === LoggerLevel.ERROR
        ? SNOWFLAKES.channels.errors
        : level === LoggerLevel.WARNING
        ? SNOWFLAKES.channels.warnings
        : level === LoggerLevel.INFO
        ? SNOWFLAKES.channels.info
        : null;

    if (channel && client.uptime !== null) {
      const discordStr = `[${this.module}] - ${message}`.slice(0, 2000);
      client.channels
        .fetch(channel)
        .then(channel => (channel as TextChannel).send(discordStr))
        .catch(NOOP);
    }
  }

  error = (message: string): void => this.log(message, LoggerLevel.ERROR);
  warning = (message: string): void => this.log(message, LoggerLevel.WARNING);
  info = (message: string): void => this.log(message, LoggerLevel.INFO);
  debug = (message: string): void => this.log(message, LoggerLevel.DEBUG);
}

export const defaultLogger = new Logger('default');
