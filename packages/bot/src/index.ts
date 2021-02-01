import { logger } from './util/logging';
import { KClient } from './base';
import { NOOP } from './util/utils';
import { prisma, getGuildSettings } from './db';
import { addMessageToSnipeCache } from './commands/snipe';
import * as reactionroles from './commands/reactionroles';

export const client = new KClient({ partials: ['REACTION', 'MESSAGE'] });

process.on('SIGTERM', () => {
  client.destroy();
  prisma.$disconnect();
  logger.info('Gracefully exiting.');
  process.exit(0);
});

client.on('ready', async () => {
  logger.info(`Logged in as ${client.user!.tag} (${client.user!.id}) | Playing in ${client.guilds.cache.size} servers`);
  logger.info(`Invite: ${await client.generateInvite({ permissions: 8 })}`);

  const updateStatus = () => client.user!.setActivity(`in ${client.guilds.cache.size} servers`);
  updateStatus();
  setInterval(updateStatus, 30 * 60 * 1000);
});

client.on('guildMemberAdd', async member => {
  const { joinMessage } = await getGuildSettings(member.guild);
  if (joinMessage) member.user.send(joinMessage).catch(NOOP);
});

client.on('messageReactionAdd', reactionroles.onMessageReactionAdd);
client.on('messageReactionRemove', reactionroles.onMessageReactionRemove);
client.on('messageDelete', addMessageToSnipeCache);

// wait for djs v13 & slash commands
export const prefix = 'k!';

client.on('message', async message => {
  try {
    await message.fetch();
    if (message.author.bot) return;
  } catch (error) {
    return;
  }

  if (
    message.mentions.has(client.user!, { ignoreRoles: true, ignoreEveryone: true }) &&
    !message.toString().toLowerCase().includes(prefix.toLowerCase())
  )
    return message.channel.send(`Do ${prefix}help for commands!`);

  if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift()!.toLowerCase();

  const command = client.commands.find(c => c.trigger === commandName);
  if (!command) return;

  if (command.guildOnly && message.channel.type !== 'text') return message.channel.send('This command only works in Guild Text Channels!');
  if (message.channel.type !== 'dm' && command.nsfw === true && !message.channel.nsfw)
    return message.channel.send('NSFW commands can only be run in NSFW channels');

  if (message.channel.type === 'dm') return command.invoke(message, args);

  return command.invoke(message, args);
});

client.login().catch(e => {
  logger.error(`Could not login because of: ${e.message} Exiting...`);
  process.exit(1);
});
