import { Client, ClientOptions, Permissions, TextChannel } from 'discord.js';
import glob from 'glob';
import { logger } from './logging';
import { Module } from './modules';
import { inspect } from 'util';
import { devPerms, READABLE_PERMISSIONS } from './utils';

export class KClient extends Client {
  dbEnabled = false;
  modules: Module[] = [];

  constructor(options: ClientOptions) {
    super(options);

    this.once('ready', async () => {
      // Load modules, and create, edit or delete slash commands to sync handlers
      glob(`${__dirname}/modules/*.js`, (err, matches) => {
        if (err) logger.error(`Error trying to get available modules: ${err?.message}`);
        matches.forEach(async file => {
          const module: Module = new (await import(file)).default();
          if (module.name.length < 1 || module.name.length > 32)
            return logger.warning(
              `Module "${module.name}"'s name does not meet the 1-32 length requirement, skipping.`
            );
          if (module.description.length < 1 || module.description.length > 100)
            return logger.warning(
              `Module "${module.name}"'s description does not meet the 1-100 length requirement, skipping.`
            );
          this.modules.push(module);
        });
      });

      const scs = await this.application!.commands.fetch();

      this.modules
        .filter(module => !scs.find(sc => sc.name === module.name) && !module.unlisted)
        .forEach(module => {
          this.application!.commands.create(module).catch(e =>
            logger.error(`Failed to create global slash command ${module.name} because of error ${e.message}`)
          );
        });

      scs.forEach(sc => {
        const module = this.modules.find(module => module.name === sc.name);
        if (module && !module.unlisted) {
          module.command = sc;
          // TODO: fix edits
          if (module.name !== '') return;
          if (module.description !== sc.description || module.options !== sc.options) {
            logger.debug('Edited global slash command');
            // @ts-expect-error wait for types to be fixed
            sc.edit({ description: module.description, options: module.options }).catch(e => {
              logger.error(`Could not edit global slash command ${module.name} because of: ${e.message}`);
              console.log(e);
            });
          }
        } else
          sc.delete().catch(e =>
            logger.error(`Could not delete global slash command ${sc.name} because of: ${e.message}`)
          );
      });
    });

    this.on('interaction', (interaction): any => {
      if (!interaction.isCommand()) return;
      const module = this.modules.find(module => interaction.commandID === module.command?.id);
      if (!module) return;

      if (!interaction.channel || !interaction.user) {
        logger.error('base -> nsfw check; unknown why channel or user is null'); // if this never fires then thank god
        return interaction.reply('This triggered a rare error! Please try again later.', { ephemeral: true });
      }

      if (module.nsfw && interaction.channel.type !== 'dm' && !(interaction.channel as TextChannel).nsfw)
        return interaction.reply('This command can only be run in nsfw channels!', { ephemeral: true });

      if (
        module.userPermissions &&
        !interaction.member?.permissionsIn(interaction.channel!).has(module.userPermissions) &&
        !devPerms(interaction.user?.id)
      ) {
        const missing = interaction.member?.permissionsIn(interaction.channel!).missing(module.userPermissions);
        if (missing)
          return interaction.reply(
            `You are missing the following permission${missing.length > 0 ? 's' : ''}: ${missing
              ?.map((perm: any) => READABLE_PERMISSIONS[perm])
              .join(', ')}`,
            { ephemeral: true }
          );
        else return interaction.reply('You are not allowed to execute that command!', { ephemeral: true });
      }

      if (module.advancedPermissions && !interaction.guild?.me?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
        return interaction.reply(
          'This command requires additional permissions that I do not have. Administrator is needed.'
        );

      if (module.requiresDb && !this.dbEnabled)
        return interaction.reply('A database error occurred, please try again later.', { ephemeral: true });

      const options: Record<string, any> = {};
      if (interaction.options) for (const option of interaction.options) options[option.name] = option;
      module.invoke(interaction, options).catch(e => {
        logger.error(inspect(e, { depth: null }));
        interaction.reply('An error occurred, please try again later.', { ephemeral: true });
      });
    });
  }
}
