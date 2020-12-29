import { Guild, GuildMember, Message } from 'discord.js';

export abstract class GuildMessage extends Message {
    abstract guild: Guild;
    abstract member: GuildMember;
}
