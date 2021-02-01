import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

logger.debug('Logger has initialized');
