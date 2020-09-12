import NodeCache from 'node-cache';
import Discord from 'discord.js';
import { db, addDefaultGuildSettings, toggleableCmds } from './db';

const guildSettingsCache = new NodeCache();

export type IGuildSettings = {
  guild: Discord.Snowflake;
  commands: typeof toggleableCmds;
  prefix: string;
  dmTextEnabled: 0 | 1;
  dmText: string;
};

export function getGuildSettings(guild: Discord.Guild): IGuildSettings | undefined {
  const { id } = guild;
  if (guildSettingsCache.has(id)) return guildSettingsCache.get(id);
  else {
    addDefaultGuildSettings(guild.id);
    let row = db.prepare('SELECT * FROM settings WHERE guild = ?').get(id);
    row.commands = JSON.parse(row.commands);
    guildSettingsCache.set(guild.id, row, guild.memberCount > 10000 ? 60 * 60 * 4 : 60 * 60);
    return row;
  }
}

export { guildSettingsCache };
