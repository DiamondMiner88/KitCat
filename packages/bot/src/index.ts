import { Collection, MessageEmbed, Permissions, TextChannel, User } from 'discord.js';
import { defaultLogger } from './logging';
import { database, getGuildSettings } from './database';
import { KClient } from './base';
import { NOOP, sleep, SNOWFLAKES } from './utils';
import './database';
import './wshandler';

export let invite = '';
let joinChannel: TextChannel;
export const client = new KClient({
  partials: ['REACTION', 'MESSAGE'],
  intents: [
    'GUILDS',
    'GUILD_MEMBERS',
    'GUILD_MESSAGE_REACTIONS',
    'DIRECT_MESSAGE_REACTIONS'
    // 'GUILD_MESSAGES',
    // 'DIRECT_MESSAGES',
  ],
  messageCacheMaxSize: 0
});

export async function exit(): Promise<void> {
  client.destroy();
  await database.end();
  defaultLogger.debug('Gracefully exiting.');
  process.exit(0);
}

process.on('SIGTERM', exit);

client.once('ready', async () => {
  defaultLogger.info(
    `Logged in as ${client.user.tag} (${client.user.id}) | Watching ${client.guilds.cache.size} servers`
  );

  const update = () => {
    client.user.setActivity(`${client.guilds.cache.size} servers`, { type: 'WATCHING' });
    client.emojis.cache.sweep(() => true);
    client.users.cache.sweep(() => true);
  };
  update();
  setInterval(update, 60 * 60 * 1000);

  invite =
    'https://discord.com/oauth2/authorize?client_id=' +
    client.user.id +
    '&scope=bot%20applications.commands&permissions=8';

  joinChannel = client.channels.resolve(SNOWFLAKES.channels.join_log) as TextChannel;

  // client.emit('guildCreate', client.guilds.cache.get('676284863967526928')!); // test guildCreate command
});

client.on('guildMemberAdd', async member => {
  const { joinMessage } = await getGuildSettings(member.guild.id, member.guild.memberCount);
  if (joinMessage) member.user.send(joinMessage as string).catch(NOOP);
});

client.on('guildCreate', async guild => {
  const logs = await guild.fetchAuditLogs({ limit: 3, type: 'BOT_ADD' }).catch(() => undefined);
  const inviter = logs?.entries.find(entry => (entry.target as User).id === client.user?.id)?.executor;
  const dm = await inviter?.createDM();
  const textchannels = guild.channels.cache.filter(channel => channel.type === 'text') as Collection<
    string,
    TextChannel
  >;
  const channels = [
    dm,
    textchannels.find(channel => channel.name.toLowerCase().includes('general')),
    textchannels.first()
  ];

  const text = `Thanks for adding me to your server${dm ? `, ${dm.recipient}` : ''}!
  ${
    !guild.me?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
      ? `I see that I do not have the Administrator permission, which is required for me to operate normally. Please add it manually or kick and reinvite me using this [link](${invite} "Bot invite").`
      : ''
  }
__**How to use me**__
To use a command, type a \`/\` in chat. A menu will pop up with the slash commands that exist on your server.
From there, select me from the sidebar on the left, and choose any command you want to run.
If your server members cannot use slash commands, then you must enable the *Use Slash Commands* permission for @everyone. (Don't worry, I didn't actually ping everyone)
`;

  for (const channel of channels) {
    if (!channel) continue;
    try {
      await sleep(5000);
      await channel.send({ content: text, allowedMentions: { parse: ['users'] } });
      break;
    } catch (error) {
      // If I cannot send this to the channel, then continue trying the next
    }
  }

  // const owner = await guild.fetchOwner({ cache: false });
  // const joinEmbed = new MessageEmbed().setTitle('Joined Server').addField('❯ Owner', `${owner.user.tag} (${owner.id})`);
  // if (guild.icon) joinEmbed.setThumbnail(guild.iconURL({ format: 'png', dynamic: true, size: 256 })!);
  // if (inviter)
  //   joinEmbed.setFooter(
  //     `Inviter: ${inviter.tag} (${inviter.id})`,
  //     inviter.displayAvatarURL({ format: 'png', dynamic: true, size: 64 })
  //   );
  // joinChannel.send({ embeds: [joinEmbed] });
});

client.login().catch(e => {
  defaultLogger.error(`Login failed. ${e.message}`);
  exit();
});
