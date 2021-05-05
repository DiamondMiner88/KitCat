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

export class Logger {
  constructor(public module: string) {}

  log(message: string, level: LoggerLevel, trace = false): void {
    // prettier-ignore
    const str = chalk`{gray [${dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss.l')}]} {${level.color} [${level.name}]} {cyanBright [${this.module}]} - ${message}`;

    if (trace) console.trace(str);
    else if (level.level == LoggerLevel.ERROR.level) {
      console.error(str);

      // Send notif to Bot testing server #notif
      if (client.uptime !== null) {
        const discordStr = `[${level.name}] [${this.module}] - ${message}`.slice(0, 2000);
        client.channels
          .fetch(SNOWFLAKES.notifications)
          .then(channel => (channel as TextChannel).send(discordStr))
          .catch(NOOP);
      }
    } else console.log(str);
  }

  error = (message: string, trace?: boolean): void => this.log(message, LoggerLevel.ERROR, trace);
  warning = (message: string, trace?: boolean): void => this.log(message, LoggerLevel.WARNING, trace);
  info = (message: string, trace?: boolean): void => this.log(message, LoggerLevel.INFO, trace);
  debug = (message: string, trace?: boolean): void => this.log(message, LoggerLevel.DEBUG, trace);
}

export const logger = new Logger('default');
