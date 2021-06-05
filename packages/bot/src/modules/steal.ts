import { DiscordAPIError, Permissions } from 'discord.js';
import { Module, ModuleCategory, OptionRole, OptionString } from '../modules';
import sharp from 'sharp';
import fetch, { FetchError } from 'node-fetch';
import { GuildCommandInteraction } from '../base';

export default class extends Module {
  name = 'steal';
  description = 'Clone an emoji or create from a url.';
  category = ModuleCategory.UTILITY;
  guildOnly = true;
  advancedPermissions = true;
  userPermissions = [Permissions.FLAGS.MANAGE_EMOJIS];

  options: any = [
    {
      type: 'STRING',
      name: 'name',
      description: 'Name for the new emoji.',
      required: true,
      choices: undefined,
      options: undefined
    },
    {
      type: 'STRING',
      name: 'emoji',
      description: 'Use an existing emoji or an emoji id.',
      required: false,
      choices: undefined,
      options: undefined
    },
    {
      type: 'STRING',
      name: 'url',
      description: 'Create from url. Will downscale to 256x256 PNG if too big.',
      required: false,
      choices: undefined,
      options: undefined
    },
    {
      type: 'ROLE',
      name: 'role',
      description: 'Roles to limit this emoji to.',
      required: false,
      choices: undefined,
      options: undefined
    }
  ];

  async invoke(
    interaction: GuildCommandInteraction,
    {
      emoji: emojiStr,
      url,
      name: { value: name },
      role
    }: { emoji: OptionString; url: OptionString; name: OptionString; role: OptionRole }
  ): Promise<any> {
    interaction.defer();

    let attachment: string | Buffer = '';

    // Create from existing emoji
    if (emojiStr) {
      // Get ID from input
      const [id] = emojiStr.value.match(/\d{17,20}/) ?? [];
      // If no match, return
      if (!id) return interaction.reply('Invalid emoji id.', { ephemeral: true });
      // Create emoji
      const url = `https://cdn.discordapp.com/emojis/${id}.png?v=1`;
      const emoji = await interaction.guild.emojis
        .create(url, name, {
          reason: `Requested by ${interaction.user.tag} (${interaction.user.id})`
        })
        .catch((e: DiscordAPIError) => e);
      // If the id was invalid, then return
      if (emoji instanceof DiscordAPIError) return interaction.editReply('Could not find that emoji!');
      // Reply with newly created emoji
      return interaction.editReply(emoji.toString());
    }
    // Create from url
    else if (url) {
      // TODO: Possible IP Leak, since the url can be pointing to a private server that logs ips. Solutions: use a proxy, or upload the image to discord using url first, then download it from discord.
      const res = await fetch(url.value)
        .then(r => r.buffer())
        .catch((e: FetchError) => e);

      if (res instanceof FetchError) return interaction.editReply('Could not get image.');

      // If emoji smaller than 256kb, then use the original url
      if (res.byteLength < 256000) attachment = url.value;
      // Otherwise, resize image
      else attachment = await sharp(res).toFormat('png').resize(128, 128).toBuffer();
    }
    // Neither url or emoji was provided
    else return interaction.editReply('No paramaters provided!');

    // Create emoji
    const emoji = await interaction.guild.emojis
      .create(attachment, name, {
        reason: `Requested by ${interaction.user.tag} (${interaction.user.id})`,
        roles: role ? [role.value] : undefined
      })
      .catch((e: DiscordAPIError) => e);
    if (emoji instanceof DiscordAPIError) interaction.editReply(`Error: ${emoji.message}`);
    else interaction.editReply(emoji.toString());
  }
}
