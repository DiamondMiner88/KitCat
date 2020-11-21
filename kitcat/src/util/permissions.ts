import { Snowflake } from 'discord.js';

export function userBypass(id: Snowflake) {
    // Make a yaml permissions config or something later
    const bypassAll = ['295190422244950017' /* DiamondMiner88 */, '407320720662855692' /* PixelDough */];
    return bypassAll.includes(id);
}
