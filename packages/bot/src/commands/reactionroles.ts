import {
  MessageEmbed,
  Message,
  Snowflake,
  TextChannel,
  Collection,
  MessageReaction,
  User,
  ReactionEmoji,
  GuildEmoji,
  PartialUser,
  Role,
  DiscordAPIError,
  Permissions,
} from 'discord.js';
import { Command, Categories } from '../commands';
import { UNICODE_EMOJI_REGEX, CUSTOM_EMOJI_REGEX, clamp, NOOP, hasPermission } from '../util/utils';
import { prisma } from '../db';
import NodeCache from 'node-cache';

// MessageId -> Record<Emoji Id/Unicode, RRSet>
const rrSetCache = new NodeCache();
type RRSet = Record<string, string>;

/**
 * // TODO: db is queried every signle time on messages that dont have RR. this is dangerous
 * Get the reaction roles if any for the message
 * @param message message sent in a TextChannel only
 */
export async function getMessageRRSet(message: Message): Promise<RRSet | undefined> {
  // Check if it exists in cache
  let rrset = rrSetCache.get<RRSet>(message.id);
  if (rrset) return rrset;

  // Since its not cached, fetch it from the db.
  let fetched = await prisma.rRSet.findFirst({ where: { messageId: message.id } });

  // If it doesn't exist in the db either, create a new record
  if (!fetched) return undefined;

  console.log(fetched.json);

  // Cache the record and return it
  rrSetCache.set(message.id, fetched.json, clamp((message.guild!.memberCount / 5) * 60, 300 /* 5 mins */, 7200 /* 2 hours */));
  return fetched.json as RRSet;
}

export function addReactionRolesToDB(message: Message, roles: RRSet) {
  prisma.rRSet.create({
    data: {
      messageId: message.id,
      guildId: message.guild!.id,
      channelId: message.channel.id,
      json: roles,
    },
  });
  rrSetCache.del(message.id);
}

export default class Roles extends Command {
  trigger = 'reactionroles';
  category = Categories.MODERATION;
  name = 'Reaction Roles';
  description = `Make a message that when reacted to, assigns you a role.`;
  usage = '';
  guildOnly = true;
  unlisted = false;
  nsfw = false;

  invoke(message: Message): any {
    if (!hasPermission(message.member!, Permissions.FLAGS.MANAGE_ROLES)) return message.channel.send(`You don't have the permission to do that!`);

    enum Actions {
      SELECT_ACTION = 0,
      DELETE_SELECT_EMOJI = 1,
      ADD_SELECT_EMOJI = 2,
      ADD_SELECT_ROLE = 3,
    }

    let msgs_sent_amount = 0;
    let current_action: Actions = Actions.SELECT_ACTION;
    let selected_emoji: string | null = null;
    let last_timeout_id: NodeJS.Timeout;
    const pairs: Record<string, Snowflake> = {};

    const update = (content = '') => {
      const e = new MessageEmbed()
        .setTitle('Reaction/Self Roles')
        .setDescription(`Hey, ${message.author}, pick one of the options below and say it!`)
        .addField('1) Add a pair', 'Emoji -> Role pair')
        .addField('2) Delete a pair', 'Deletes a pair by emoji.')
        .addField('3) Done', 'Finishes this up and deletes the messages.')
        .addField('4) Cancel', 'Cancels this and deletes the messages.');

      const out = new Collection(Object.entries(pairs))
        .map((role, emoji) => `${message.guild?.emojis.cache.get(emoji) || emoji} -> <@&${role}>`)
        .join('\n');
      e.addField('Current added roles', out.length > 0 ? out : '*None yet*');
      if (content) message.channel.send(content, e);
      else message.channel.send(e);
    };

    const parseEmoji = (content: string) => {
      const customemoji = content.match(CUSTOM_EMOJI_REGEX);
      if (customemoji) return customemoji[3];
      const unicodeemoji = content.match(UNICODE_EMOJI_REGEX);
      if (unicodeemoji) return unicodeemoji[0];
      return null;
    };

    const collector = message.channel.createMessageCollector(() => true);

    const newTimeout = () => {
      clearInterval(last_timeout_id);
      last_timeout_id = setTimeout(() => {
        message.channel.send(`${message.author}, it has been 10 minutes since you last sent something so I have automatically canceled.`);
        collector.stop();
      }, 10 * 60 * 1000);
    };

    collector.on('collect', async (m: Message) => {
      m.channel = m.channel as TextChannel;

      msgs_sent_amount++;
      if (message.author.id !== m.author.id) return;
      newTimeout();

      switch (current_action) {
        case Actions.SELECT_ACTION: {
          switch (m.content) {
            case '1':
              message.channel.send('Give me an emoji.');
              return (current_action = Actions.ADD_SELECT_EMOJI);
            case '2': {
              message.channel.send('Give me an emoji that you already added.');
              return (current_action = Actions.DELETE_SELECT_EMOJI);
            }
            case '3': {
              collector.stop();
              return m.channel
                .bulkDelete(clamp(msgs_sent_amount, 0, 100))
                .then(() => {
                  let error: DiscordAPIError | null = null;
                  for (const emoji in pairs) message.react(emoji).catch(e => (error = e));
                  if (error) message.channel.send(error!.message);
                  addReactionRolesToDB(message, pairs);
                  m.channel
                    .send('I reacted to your original message, now you can edit it to your liking.')
                    .then(m => setTimeout(() => m.delete().catch(NOOP), 5000));
                  clearInterval(last_timeout_id);
                })
                .catch((e: any) => m.author.send(e).catch(NOOP));
            }
            case '4':
              collector.stop();
              clearInterval(last_timeout_id);
              return m.channel.bulkDelete(clamp(msgs_sent_amount, 0, 100));
            default:
              return message.channel.send('That is not one of the options!');
          }
        }
        case Actions.ADD_SELECT_EMOJI: {
          selected_emoji = parseEmoji(m.content);
          if (!selected_emoji) return message.channel.send('That is not a emoji!');
          current_action = Actions.ADD_SELECT_ROLE;
          return message.channel.send('Now give me a role! Format: { Mention | RoleID | Role Name }');
        }
        case Actions.ADD_SELECT_ROLE: {
          let r: Role | undefined;
          try {
            r = await (m.mentions.roles.first() || message.guild?.roles.cache.find(r => r.name === m.content || r.id === m.content));
          } catch (error) {
            return message.channel.send(`Couldn't find a role by \`${m.content}\``);
          }
          if (!r) return message.channel.send(`Couldn't find a role by \`${m.content}\``);
          if (r.managed) return message.channel.send(`You can't add auto-managed bot roles to users!`);
          if (r.id === message.guild?.id) return message.channel.send(`You can't assign \`@everyone\` to users, they already have it!`);
          if (message.guild!.me!.roles.highest.position < r.position)
            return message.channel.send(`I can't assign the role ${r.name} because it is higher in the role heiarchy than me.`);
          pairs[selected_emoji!] = r.id;
          current_action = Actions.SELECT_ACTION;
          return update(`Success! Added role \`${r.name}\``);
        }
        case Actions.DELETE_SELECT_EMOJI: {
          selected_emoji = parseEmoji(m.content);
          if (!selected_emoji) return message.channel.send('That is not a emoji!');
          if (!pairs[selected_emoji]) return message.channel.send(`That pair doesn't exist!`);
          current_action = Actions.SELECT_ACTION;
          delete pairs[selected_emoji];
          return update('Successfully deleted pair!');
        }
      }
    });

    update();
  }
}

export async function onMessageReactionAdd(reaction: MessageReaction, user: User | PartialUser): Promise<any> {
  try {
    await reaction.fetch();
  } catch (error) {
    return;
  }

  if (reaction.message.channel.type !== 'text' || user.bot) return;

  const msgSelfRoles = await getMessageRRSet(reaction.message);
  if (!msgSelfRoles) return;

  const member = await reaction.message.guild!.members.fetch(user as User);
  if (!member) return;

  let emojiToAdd: string | undefined;
  if (reaction.emoji instanceof ReactionEmoji && msgSelfRoles[reaction.emoji.name]) emojiToAdd = msgSelfRoles[reaction.emoji.name];
  else if (reaction.emoji instanceof GuildEmoji && msgSelfRoles[reaction.emoji.id]) emojiToAdd = msgSelfRoles[reaction.emoji.id];

  if (!emojiToAdd) return reaction.remove().catch(NOOP);

  member.roles.add(emojiToAdd, `${member.user.tag} requested for the role to be added using a reaction.`).catch(r => {
    member.send(r).catch(NOOP);
  });
}

export async function onMessageReactionRemove(reaction: MessageReaction, user: User | PartialUser): Promise<any> {
  try {
    await reaction.fetch();
  } catch (error) {
    return;
  }

  if (reaction.message.channel.type !== 'text' || user.bot) return;

  const msgSelfRoles = await getMessageRRSet(reaction.message);
  if (!msgSelfRoles) return;

  const member = await reaction.message.guild!.members.fetch(user as User);
  if (!member) return;

  let emojiToAdd: string | undefined;
  if (reaction.emoji instanceof ReactionEmoji && msgSelfRoles[reaction.emoji.name]) emojiToAdd = msgSelfRoles[reaction.emoji.name];
  else if (reaction.emoji instanceof GuildEmoji && msgSelfRoles[reaction.emoji.id]) emojiToAdd = msgSelfRoles[reaction.emoji.id];

  if (!emojiToAdd) return reaction.remove().catch(NOOP);

  member.roles.remove(emojiToAdd, `${member.user.tag} requested for the role to be removed using a reaction.`).catch(r => {
    member.send(r).catch(NOOP);
  });
}

// TODO: detect message deletions and automatically delete it from db
