import better_sqlite3 from 'better-sqlite3';

export const db = better_sqlite3('../config/data.db');

const users_tbl = `
CREATE TABLE IF NOT EXISTS "users" (
  "guild" INTEGER NOT NULL,
  "user" INTEGER NOT NULL,
  "warns" INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY("guild","user")
);`;
db.prepare(users_tbl).run();

const settings_tbl = `
CREATE TABLE IF NOT EXISTS "settings" (
  "guild"	TEXT NOT NULL,
  "commands" TEXT NOT NULL,
  "prefix" TEXT NOT NULL DEFAULT 'k!',
  "dmTextEnabled" INTEGER NOT NULL DEFAULT 0,
  "dmText" TEXT NOT NULL DEFAULT '',
  "audit_channel" TEXT NOT NULL DEFAULT '',
  PRIMARY KEY("guild")
);`;
db.prepare(settings_tbl).run();

const selfroles_tbl = `
CREATE TABLE IF NOT EXISTS "selfroles" (
	"message" TEXT NOT NULL UNIQUE,
  "guild" TEXT NOT NULL,
	"roles" TEXT NOT NULL,
	PRIMARY KEY("message")
);`;
db.prepare(selfroles_tbl).run();

export const toggleableCmds: Record<string, 0 | 1> = {
  ban: 1,
  kick: 1,
  meme: 1,
  nhentai: 1,
  nsfw: 1,
  purge: 1,
  purgechannel: 1,
  submission: 1,
  tts: 1,
  warn: 1
};

export function addDefaultGuildSettings(guildid: string) {
  db.prepare('INSERT OR IGNORE INTO settings (guild, commands) VALUES(?, ?)').run(
    guildid,
    JSON.stringify(toggleableCmds)
  );
}
