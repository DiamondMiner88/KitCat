const Discord = require('discord.js');
const { spawn } = require('child_process');

module.exports = {
  command: 'dev',
  guildOnly: false,
  unlisted: true,

  /**
   * Developer commands
   * @param {Discord.TextChannel} message
   * @param {Array.<String>} args
   */
  async execute(message, args) {
    if (
      ['295190422244950017', '407320720662855692', '678683775017943050'].includes(message.author.id)
    ) {
      const command = args.shift();
      switch (command) {
        case 'restart':
          process.exit(2);
          break;
        case 'exit':
          process.exit(0);
          break;
        case 'update':
          message.channel.send('Pulling new commits...');
          const git = spawn('git', ['pull', 'origin', 'master']);
          git.stdout.on('data', (data) => message.channel.send(data.toString()));
          git.stderr.on('data', (data) => message.channel.send(data.toString()));
          git.on('close', (code) => {
            message.channel.send('Updating packages, will restart after npm finishes.');
            var npm = require('npm');
            npm.load(
              {
                save: true,
                'save-dev': true
              },
              () => {
                npm.commands.install([], function (err, d) {
                  if (err) message.channel.send(err + '\nAborting restart.');
                  else process.exit(2);
                });
              }
            );
          });
          break;
        default:
          message.channel.send('That is not a valid subcommand!');
          break;
      }
    } else message.channel.send('This command is only for my developers!');
  }
};
