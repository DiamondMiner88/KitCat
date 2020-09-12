import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { getLogger, shutdownLogger } from './util/logging';
import cleanup from 'node-cleanup';

var bot: ChildProcessWithoutNullStreams;

const LOGGER = getLogger('run.ts');
const BOTLOGGER = getLogger('bot');

cleanup((code, signal) => {
  LOGGER.info(`Exiting with code ${code}`);
  shutdownLogger();
});

(function start() {
  bot = spawn('node', ['bot.js'].concat(process.argv.splice(2)));

  bot.stdout.on('data', (data) => BOTLOGGER.info(data.toString()));
  bot.stderr.on('data', (data) => BOTLOGGER.error(data.toString()));

  LOGGER.debug('Bot process is starting.');

  bot.on('close', (code) => {
    LOGGER.info('Bot exited with code ' + code);
    if (code === 2) start();
  });
})();
