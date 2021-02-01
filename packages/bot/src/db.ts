import { GuildSettings, PrismaClient } from '@prisma/client';
import { Guild } from 'discord.js';
import NodeCache from 'node-cache';
import { clamp } from './util/utils';

export const prisma = new PrismaClient();

export const cachedSettings = new NodeCache();

export async function getGuildSettings(guild: Guild): Promise<GuildSettings> {
  // Check if it exists in cache
  let settings = cachedSettings.get<GuildSettings>(guild.id);
  if (settings) return settings;

  // Since its not cached, fetch it from the db.
  let fetched = await prisma.guildSettings.findFirst({ where: { id: guild.id } });

  // If it doesn't exist in the db either, create a new record
  if (!fetched) {
    fetched = await prisma.guildSettings.create({
      data: {
        id: guild.id,
      },
    });
  }

  // Cache the record and return it
  cachedSettings.set(guild.id, fetched, clamp((guild.memberCount / 5) * 60, 300 /* 5 mins */, 7200 /* 2 hours */));
  return fetched!;
}
