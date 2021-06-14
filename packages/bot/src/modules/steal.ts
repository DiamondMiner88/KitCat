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
      required: false,
      choices: undefined,
      options: undefined
    },
    {
      type: 'STRING',
      name: 'emoji',
      description: 'Existing server emoji/emoji id.',
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

    if (emojiStr) {
      const [_, isAnimated, extractedName, id] = emojiStr.value.match(/<?(a)?:?(\w{2,32})?:?(\d{17,19})>?/) ?? [];
      name = name ?? extractedName;

      if (!name) return interaction.editReply('You need to supply a name!');
      if (name.length < 2 || name.length > 32) return interaction.editReply('Name must be between 2 and 32 in length!');

      if (!id) return interaction.editReply({ content: 'Invalid emoji!' });

      const emoji = await interaction.guild.emojis
        .create(`https://cdn.discordapp.com/emojis/${id}.${isAnimated ? 'gif' : 'png'}`, name, {
          reason: `Requested by ${interaction.user.tag} (${interaction.user.id})`,
          roles: role ? [role.value] : undefined
        })
        .catch(e => e as DiscordAPIError);

      if (emoji instanceof DiscordAPIError) {
        if (emoji.code === 30008) return interaction.editReply(emoji.message);
        if (emoji.code === 50035) return interaction.editReply('Invalid emoji ID!');
        return interaction.editReply(`Error: ${emoji.message}`);
      }

      return interaction.editReply(emoji.toString());
    } else if (url) {
      // TODO: Possible IP Leak, since the url can be pointing to a private server that logs ips. Solutions: use a proxy, or upload the image to discord using url first, then download it from discord.
      const res = await fetch(url.value)
        .then(r => r.buffer())
        .catch((e: FetchError) => e);

      if (res instanceof FetchError) return interaction.editReply('Invalid url');

      // If smaller than 256kb, then use url, otherwise resize
      const attachment =
        res.byteLength < 256000 ? url.value : await sharp(res).toFormat('png').resize(128, 128).toBuffer();

      // Create emoji
      const emoji = await interaction.guild.emojis
        .create(attachment, name, {
          reason: `Requested by ${interaction.user.tag} (${interaction.user.id})`,
          roles: role ? [role.value] : undefined
        })
        .catch((e: DiscordAPIError) => e);
      // TODO: different messages for max emojis reached & other errors
      if (emoji instanceof DiscordAPIError) interaction.editReply(`Error: ${emoji.message}`);
      else interaction.editReply(emoji.toString());
    }
    // Neither url or emoji was provided
    else return interaction.editReply('No paramaters provided!');
  }
}
