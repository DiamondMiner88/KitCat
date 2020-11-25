import NodeCache from 'node-cache';
import { Guild, Snowflake } from 'discord.js';
import { db, addDefaultGuildSettings, toggleableCmds } from './db';

const guildSettingsCache = new NodeCache();

export type IGuildSettings = {
    prefix: string;
    guild?: Snowflake;
    commands?: typeof toggleableCmds;
    dmTextEnabled?: 0 | 1;
    dmText?: string;
    log_channel?: string;
};

export function getGuildSettings(guild: Guild): IGuildSettings {
    const { id } = guild;
    if (guildSettingsCache.has(id)) return guildSettingsCache.get(id);
    addDefaultGuildSettings(id);
    const row = db.prepare('SELECT * FROM settings WHERE guild = ?').get(id);
    row.commands = JSON.parse(row.commands);
    guildSettingsCache.set(guild.id, row, guild.memberCount > 10000 ? 60 * 60 * 4 : 60 * 60);
    return row;
}

export { guildSettingsCache };
