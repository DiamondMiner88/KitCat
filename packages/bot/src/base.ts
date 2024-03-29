import {
  Client,
  ClientApplication,
  ClientOptions,
  ClientUser,
  CommandInteraction,
  CommandInteractionOption,
  Guild,
  GuildMember,
  Permissions,
  TextChannel
} from 'discord.js';
import glob from 'glob';
import { defaultLogger } from './logging';
import { Module } from './modules';
import { inspect } from 'util';
import { devPerms, makeList, READABLE_PERMISSIONS } from './utils';

export class KClient extends Client {
  dbEnabled = false;
  modules: Module[] = [];
  //@ts-expect-error Type override
  user: ClientUser;
  //@ts-expect-error Type override
  application: ClientApplication;

  constructor(options: ClientOptions) {
    super(options);

    this.once('ready', async () => {
      // Load modules, and create, edit or delete slash commands to sync handlers
      glob(`${__dirname}/modules/*.js`, (err, matches) => {
        if (err) defaultLogger.error(`Error trying to get available modules: ${err?.message}`);
        matches.forEach(async file => {
          const module: Module = new (await import(file)).default();
          if (module.name.length < 1 || module.name.length > 32)
            return defaultLogger.warning(
              `Module "${module.name}"'s name does not meet the 1-32 length requirement, skipping.`
            );
          if (module.description.length < 1 || module.description.length > 100)
            return defaultLogger.warning(
              `Module "${module.name}"'s description does not meet the 1-100 length requirement, skipping.`
            );
          this.modules.push(module);
        });
      });

      const scs = await this.application.commands.fetch();

      this.modules
        .filter(module => !scs.find(sc => sc.name === module.name) && !module.unlisted)
        .forEach(module => {
          this.application.commands
            .create({
              name: module.name,
              description: module.description,
              options: module.options
            })
            .catch(e =>
              defaultLogger.error(`Failed to create global slash command ${module.name} because of error ${e.message}`)
            );
        });

      scs.forEach(sc => {
        const module = this.modules.find(module => module.name === sc.name);
        if (module && !module.unlisted) {
          module.command = sc;
          // TODO: fix edits
          if (module.name !== '') return;
          if (module.description !== sc.description || module.options !== sc.options) {
            defaultLogger.debug(`Edited global slash command ${module.name}`);
            // @ts-expect-error wait for types to be fixed
            sc.edit({ description: module.description, options: module.options }).catch(e => {
              defaultLogger.error(`Could not edit global slash command ${module.name} because of: ${e.message}`);
              console.log(e);
            });
          }
        } else
          sc.delete().catch(e =>
            defaultLogger.error(`Could not delete global slash command ${sc.name} because of: ${e.message}`)
          );
      });
    });

    this.on('interaction', async interaction => {
      if (!interaction.isCommand()) return;

      const module = this.modules.find(module => interaction.commandID === module.command?.id);
      if (!module) return;

      // Guild check
      if (module.guildOnly && !interaction.guild)
        return interaction.reply({ content: 'This module can only be used in servers!', ephemeral: true });

      // NSFW check
      if (module.nsfw && interaction.channel.type !== 'dm' && !(interaction.channel as TextChannel).nsfw)
        return interaction.reply({ content: 'This module can only be run in nsfw channels!', ephemeral: true });

      // Permission checks
      if (
        module.userPermissions && // Check if module has required permissions
        module.guildOnly && // Check if the module is guild only
        interaction.guild && // Check if this is invoked from a guild channel
        interaction.guild.ownerID !== interaction.user.id && // Check if the user is not the owner
        !devPerms(interaction.user)
      ) {
        if (!interaction.member) {
          defaultLogger.warning(
            `Interaction: member not cached for user ${interaction.user.tag} (${interaction.user.id})`
          ); // this should not happen
          return interaction.reply({
            content: 'Could not find your permissions, please try again later.',
            ephemeral: true
          });
        }

        const missingFlags = (interaction.member as GuildMember)
          .permissionsIn(interaction.channel)
          .missing(module.userPermissions);
        const missing = new Permissions(missingFlags).toArray().map(perm => READABLE_PERMISSIONS[perm]);
        if (missing.length > 0)
          return interaction.reply({
            content:
              missing.length > 1
                ? `You are missing the following permissions:\n${makeList(...missing.map(e => [e] as [string]))}`
                : `You are missing the ${missing[0]} permission`,
            ephemeral: true
          });
      }

      // Check bot permissions
      if (module.advancedPermissions && !interaction.guild?.me?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
        return interaction.reply(
          'This module requires additional permissions that I do not have. Administrator is needed.'
        );

      // Check if connected to db
      if (module.requiresDb && !this.dbEnabled)
        return interaction.reply({ content: 'A database error occurred, please try again later.', ephemeral: true });

      // Handle interaction
      const options: Record<string, CommandInteractionOption> = {};
      // TODO: verify option[0] is the name
      if (interaction.options) for (const option of interaction.options) options[option[0]] = option[1];
      module.invoke(interaction, options).catch(e => {
        defaultLogger.error(inspect(e, { depth: 3 }));
        interaction.reply({ content: 'An error occurred, please try again later.', ephemeral: true });
      });
    });
  }
}

export interface KCommandInteraction extends CommandInteraction {
  client: KClient;
  member: GuildMember | null;
}

export interface GuildCommandInteraction extends KCommandInteraction {
  guild: Guild;
  member: GuildMember;
}
