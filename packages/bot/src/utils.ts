import {
  APIMessageContentResolvable,
  Message,
  MessageAdditions,
  MessageOptions,
  TextChannel,
  GuildMember,
  PermissionResolvable
} from 'discord.js';
import { Guild } from 'discord.js';
import { getGuildSettings } from './database';

export const UNICODE_EMOJI_REGEX = /(?:\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c\udffb|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c\udffb|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c\udffb|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb\udffc]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udffd]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d])|(?:\ud83d[\udc68\udc69])(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a-\udc6d\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5\udeeb\udeec\udef4-\udefa\udfe0-\udfeb]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd71\udd73-\udd76\udd7a-\udda2\udda5-\uddaa\uddae-\uddb4\uddb7\uddba\uddbc-\uddca\uddd0\uddde-\uddff\ude70-\ude73\ude78-\ude7a\ude80-\ude82\ude90-\ude95]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g;
export const CUSTOM_EMOJI_REGEX = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/;

/**
 * Clamps a value to between min and max (inclusive iirc)
 * @param num Number to clamp
 * @param min Minimum value that the number can be
 * @param max Maximum value that the number can be
 * @returns New clamped number
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.max(min, Math.min(num, max));
}

/**
 * Special users that bypass all permissions of guilds & bot to allow usage of perm-required commandsor dev only commands
 * @param id User id
 * @returns True if user has permission
 */
export function devPerms(id?: string): boolean {
  if (!id) return false;
  const bypassAll = [SNOWFLAKES.Diamond, SNOWFLAKES.PixelDough];
  return bypassAll.includes(id);
}

/**
 * NOOP function
 * @param params Any params
 */
// eslint-disable-next-line
export const NOOP = (...params: any): undefined => undefined;

/**
 * Snowflakes that are used internally
 */
export const SNOWFLAKES = {
  // Servers
  bot_testing: '676284863967526928',
  pcms_server: '752212085672247296',

  // Users
  Diamond: '295190422244950017',
  PixelDough: '407320720662855692',

  // Channels
  notifications: '816173167654469673'
};

/**
 * Bring back GuildMember#hasPermission from v12 && combine devPerms at once
 * Checks if any of this member's roles have a permission.
 * @param {GuildMember} member To check permissions on
 * @param {PermissionResolvable} permission Permission(s) to check for
 * @param {Object} [options] Options
 * @param {boolean} [options.checkAdmin=true] Whether to allow the administrator permission to override
 * @param {boolean} [options.checkOwner=true] Whether to allow being the guild's owner to override
 * @returns {boolean}
 */
export function hasPermission(
  member?: GuildMember,
  permission?: PermissionResolvable,
  { checkAdmin = true, checkOwner = true } = {}
): boolean {
  if (!member) return false;
  if (checkOwner && member.id === member.guild.ownerID) return true;
  if (devPerms(member.id)) return true;
  if (!permission) return false;
  return member.permissions.has(permission, checkAdmin);
}

export const emojis = {
  badges: {
    balance: '<:balance:816740657229594665>',
    bravery: '<:bravery:816740657690443857>',
    brilliance: '<:brilliance:816740657892818984>',
    boost_1: '<:boost_1:816740656936255559>',
    boost_2: '<:boost_2:816740657217536020>',
    boost_3: '<:boost_3:816740657250828339>',
    boost_4: '<:boost_4:816740657296965692>',
    boost_5: '<:boost_5:816740657200496700>',
    boost_6: '<:boost_6:816740657192370227>',
    boost_7: '<:boost_7:816740657460805662>',
    boost_8: '<:boost_8:816740657876041748>',
    boost_9: '<:boost_9:816740657829380166>',
    bughunter_1: '<:bughunter_1:816740657527521291>',
    bughunter_2: '<:bughunter_2:816740658000822322>',
    early_supporter: '<:early_supporter:816740658043682866>',
    employee: '<:employee:816740657867391026>',
    hypesquad_events: '<:hypeqquad_events:816740657770004481>',
    nitro: '<:nitro:816740658232557568>',
    partner: '<:partner:816740658328502352>',
    verified_developer: '<:verified_developer:816740658223382568>'
  },
  server_boost: '<:server_boost:824825909697445909>'
};

export function msToUI(ms: number): string {
  const seconds = +(ms / 1000).toFixed(0);
  const minutes = +(ms / (1000 * 60)).toFixed(0);
  const hours = +(ms / (1000 * 60 * 60)).toFixed(0);
  const days = +(ms / (1000 * 60 * 60 * 24)).toFixed(0);
  const months = +(ms / 2.628e9).toFixed(0);
  const years = +(ms / 31557600000).toFixed(0);

  if (seconds < 60) return seconds + ` Second${seconds > 1 ? 's' : ''}`;
  else if (minutes < 60) return minutes + ` Minute${minutes > 1 ? 's' : ''}`;
  else if (hours < 24) return hours + ` Hour${hours > 1 ? 's' : ''}`;
  else if (days < 30) return days + ` Day${days > 1 ? 's' : ''}`;
  else if (months < 12) return months + ` Month${months > 1 ? 's' : ''}`;
  else return years + ` Year${years > 1 ? 's' : ''}`;
}

export const READABLE_PERMISSIONS: Record<string, string> = {
  CREATE_INSTANT_INVITE: 'Create Invite',
  KICK_MEMBERS: 'Kick',
  BAN_MEMBERS: 'Ban',
  ADMINISTRATOR: 'Administrator',
  MANAGE_CHANNELS: 'Manage Channels',
  MANAGE_GUILD: 'Manage Server',
  ADD_REACTIONS: 'Add Reactions',
  VIEW_AUDIT_LOG: 'View audit log',
  PRIORITY_SPEAKER: 'Priority Speaker',
  STREAM: 'Stream Video',
  VIEW_CHANNEL: 'View Channels',
  SEND_MESSAGES: 'Send Messages',
  SEND_TTS_MESSAGES: 'Send Text-To-Speech Messages',
  MANAGE_MESSAGES: 'Manage Messages',
  EMBED_LINKS: 'Embed Links',
  ATTACH_FILES: 'Attach Files',
  READ_MESSAGE_HISTORY: 'Read Message History',
  MENTION_EVERYONE: 'Mention Everyone',
  USE_EXTERNAL_EMOJIS: 'Use External Emojis',
  VIEW_GUILD_INSIGHTS: 'View Guild Insights',
  CONNECT: 'Connect To Voice',
  SPEAK: 'Speak',
  MUTE_MEMBERS: 'Mute',
  DEAFEN_MEMBERS: 'Deafen',
  MOVE_MEMBERS: 'Move Members',
  USE_VAD: 'Use Voice Activity',
  CHANGE_NICKNAME: 'Change Nickname',
  MANAGE_NICKNAMES: 'Manage Nicknames',
  MANAGE_ROLES: 'Manage Roles',
  MANAGE_WEBHOOKS: 'Manage Webhooks',
  MANAGE_EMOJIS: 'Manage Emojis',
  USE_APPLICATION_COMMANDS: 'Use Slash Commands'
};

/**
 * Used for formatting timestamps to display
 */
export const dateFormatStr = 'yyyy-mm-dd HH:MM:ss';

/**
 * Log a message to a guild's Log Channel
 * @param guild The guild this message is for
 * @param content Resolvable message content
 * @param options Optional message options
 * @returns The sent message
 */
export async function sendToLogChannel(
  guild: Guild,
  content: APIMessageContentResolvable | MessageAdditions,
  options: MessageOptions = {}
): Promise<Message | Error | undefined> {
  const settings = await getGuildSettings(guild.id, guild.memberCount);
  if (!settings.logChannel) return; // No logChannel set, ignore

  const channel = await guild.channels.resolve(settings.logChannel);
  if (!channel || channel.type !== 'text') return; // logChannel no longer exists or it is not a TextChannel, ignore

  return (channel as TextChannel).send(content, options).catch(e => e);
}

/**
 * Pause execution for a certain amount of milliseconds
 * @param ms Milliseconds
 */
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
