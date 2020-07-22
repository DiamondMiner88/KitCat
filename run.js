const { spawn } = require('child_process');

try {
  require("./config/config.json")
} catch (e) {
  console.error("You do not have /config/config.json. Please rename config-exmaple.json to config.json and fill out the fields.");
  process.exit(1);
}

var bot;

function startBot() {
  bot = spawn('node', ["bot.js"]);

  bot.stdout.on('data', data => console.log(data.toString()));
  bot.stderr.on('data', data => console.error(data.toString()));

  bot.on('close', code => {
    if (code === 2) startBot();
  });
}

startBot();
