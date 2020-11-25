import Discord, { TextChannel } from 'discord.js';
import { Command } from '../commands';
import { userBypass } from '../util/utils';

export default class PurgeChannel extends Command {
    executor = 'purgechannel';
    category = 'moderation';
    display_name = `🗑️ Purge Channel`;
    description = `Used to delete to wipe all messages in a channel. ***This command deletes and makes a new channel. Pins will be gone***`;
    usage = '';
    guildOnly = true;
    unlisted = false;
    nsfw = false;

    async run(message: Discord.Message): Promise<any> {
        message.channel = message.channel as TextChannel;

        if (!message.member.hasPermission('MANAGE_MESSAGES') && !userBypass(message.author.id))
            return message.channel.send('You do not have the permission to manage messages.');
        if (!message.channel.deletable) return message.channel.send(`I don't have permission to delete this channel!`);

        const { rawPosition } = message.channel;

        let newChnl: Discord.TextChannel | Discord.NewsChannel;
        try {
            newChnl = await message.channel.clone();
        } catch (error) {
            message.channel.send('Error cloning this channel!\n' + error);
        }

        message.channel
            .delete()
            .then(() => {
                newChnl.setPosition(rawPosition);
            })
            .catch((err) => {
                message.channel.send('Error deleting this channel!\n' + err.message);
            });
    }
}
