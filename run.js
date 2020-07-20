const { spawn } = require('child_process');

var bot;

function startBot() {
  bot = spawn('node', ["bot.js"]);

  bot.stdout.on('data', data => console.log(data.toString()));
  bot.stderr.on('data', data => console.error(data.toString()));

  bot.on('close', code => {
    if (code === 5001) startBot();
  });
}

startBot();
