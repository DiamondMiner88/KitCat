import NodeCache from 'node-cache';
import { logger } from './logging';
import { clamp } from './utils';
import { client } from '.';
import { Client } from 'pg';
import { Snowflake } from 'discord.js';

export const database = new Client();
database
  .connect()
  .then(() => (client.dbEnabled = true))
  .catch(e => logger.error(`Could not connect to database because of: ${e}`));

database.on('end', () => {
  client.dbEnabled = false;
  logger.error('Disconnected from database, continuing...');
});

//#region Database types
type GuildSettings = {
  id: Snowflake;
  joinMessage?: string;
  logChannel?: Snowflake;
  reportChannel?: Snowflake;
  autoRoles?: Snowflake[];
  createdAt: string;
};
//#endregion

export const cachedSettings = new NodeCache();
export async function getGuildSettings(id: string, memberCount?: number): Promise<GuildSettings> {
  // Check if it exists in cache
  const settings = cachedSettings.get<GuildSettings>(id);
  if (settings) return settings;

  // Since its not cached, fetch it from the db.
  const query = `
      WITH s AS (
          SELECT * FROM "GuildSettings" WHERE id = $1
      ), i as (
          INSERT INTO "GuildSettings" ("id")
          SELECT $1::text
          WHERE NOT EXISTS (SELECT 1 FROM s)
          RETURNING *
      )
      SELECT * FROM i
      UNION ALL
      SELECT * FROM s
  `;
  const results = await database.query(query, [id]);

  // Cache the record and return it
  if (memberCount)
    cachedSettings.set(id, results.rows[0], clamp((memberCount / 5) * 60, 300 /* 5 mins */, 7200 /* 2 hours */));
  return results.rows[0];
}
