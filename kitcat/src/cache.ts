import NodeCache from 'node-cache';
import { Guild, Message, Snowflake } from 'discord.js';
import { db, addDefaultGuildSettings, toggleableCmds } from './db';

// Guild settings
const guildSettingsCache = new NodeCache();

export type IGuildSettings = {
    guild?: Snowflake;
    prefix: string;
    commands?: typeof toggleableCmds;
    dmTextEnabled?: 0 | 1;
    dmText?: string;
    audit_channel?: string;
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

// Guild selfroles
const guildSelfRolesCache = new NodeCache();

export type IGuildSelfRoles = {
    [message: string]: Record<string, string>;
};

export function getGuildSelfRoles(guild: Guild): IGuildSelfRoles {
    const { id } = guild;
    if (guildSelfRolesCache.has(id)) return guildSelfRolesCache.get(id);
    const rows = db.prepare('SELECT message, roles FROM "selfroles" WHERE guild = ?').all(id);
    const selfRoles: IGuildSelfRoles = {};
    rows.forEach((row) => (selfRoles[row.message] = JSON.parse(row.roles)));
    guildSelfRolesCache.set(id, selfRoles, guild.memberCount > 10000 ? 60 * 60 * 4 : 60 * 60);
    return selfRoles;
}

export function addSelfRolesToDB(message: Message, roles: Record<string, Snowflake>) {
    db.prepare('INSERT OR IGNORE INTO "selfroles" (message, guild, roles) VALUES (?, ?, ?)').run(
        message.id,
        message.guild.id,
        JSON.stringify(roles)
    );
    guildSelfRolesCache.del(message.guild.id);
}

export { guildSettingsCache };
