import { Client, ClientOptions, Collection, CommandInteraction, Permissions } from 'discord.js';
import { Command } from './commands';
import glob from 'glob';
import { logger } from './logging';
import { Module } from './modules';
import { inspect } from 'util';
import { devPerms, READABLE_PERMISSIONS } from './utils';

export class KClient extends Client {
  dbEnabled: boolean = false;
  commands: Command[] = [];
  modules: Module[] = [];

  constructor(options: ClientOptions) {
    super(options);

    // Load text commands
    // glob(`${__dirname}/commands/*.js`, (err, matches) => {
    //   if (err) logger.error(`Error trying to get available commands: ${err?.message}`);
    //   matches.forEach(async file => this.commands.push(new (await import(file)).default()));
    // });

    this.once('ready', async () => {
      // console.log('applicationID: ' + this.interactionClient.applicationID);
      // @ts-expect-error Wait for these to not be undefined
      this.interactionClient.clientID = this.user!.id;
      this.interactionClient.applicationID = this.user!.id;
      if (!this.token) logger.error('Discord token missing!');
      else this.interactionClient.token = this.token;

      // Load modules, and create, edit or delete slash commands to sync handlers
      glob(`${__dirname}/modules/*.js`, (err, matches) => {
        if (err) logger.error(`Error trying to get available modules: ${err?.message}`);
        matches.forEach(async file => {
          const module: Module = new (await import(file)).default();
          if (module.name.length < 1 || module.name.length > 32)
            return logger.warning(`Module "${module.name}"'s name does not meet the 1-32 length requirement, skipping.`);
          if (module.description.length < 1 || module.description.length > 100)
            return logger.warning(`Module "${module.name}"'s description does not meet the 1-100 length requirement, skipping.`);
          this.modules.push(module);
        });
      });

      const scs = await this.interactionClient.fetchCommands();
      // console.log(require('util').inspect(scs, { colors: true, depth: null }));

      this.modules
        .filter(module => !scs.find(sc => sc.name === module.name) && !module.unlisted)
        .forEach(module => {
          this.interactionClient
            // @ts-expect-error wait for types to be fixed
            .createCommand({
              name: module.name,
              description: module.description,
              options: module.options,
            })
            .catch(e => logger.error(`Failed to create global slash command ${module.name} because of error ${e.message}`));
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
        } else sc.delete().catch(e => logger.error(`Could not delete global slash command ${sc.name} because of: ${e.message}`));
      });
    });

    // @ts-expect-error wait for types to be fixed
    this.on('interactionCreate', (interaction: CommandInteraction) => {
      const module = this.modules.find(module => interaction.commandID === module.command?.id);
      if (!module) return;

      if (module.nsfw) {
        if (!interaction.channel) {
          logger.error('base -> nsfw check; unknown why channel is null'); // if this never fires then thank god
          return interaction.reply('This triggered a rare error! Please try again later.');
        }
        if (interaction.channel.type !== 'dm' && !interaction.channel.nsfw)
          return interaction.reply('This command is only available in nsfw channels!');
      }

      if (
        module.userPermissions &&
        !interaction.member?.permissionsIn(interaction.channel!).has(module.userPermissions) &&
        !devPerms(interaction.user?.id)
      ) {
        const missing = interaction.member?.permissionsIn(interaction.channel!).missing(module.userPermissions);
        return interaction.reply(
          `You are missing the following permission(s) needed in order to use this command: ${missing
            ?.map(perm => READABLE_PERMISSIONS[perm])
            .join(', ')}`,
        );
      }

      if (module.advancedPermissions && !interaction.guild?.me?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
        return interaction.reply('This command requires other permissions, please give me Administrator in order to use this command.');

      if (module.requiresDb && !this.dbEnabled) return interaction.reply('A database error occurred, please try again later.');

      const options: Collection<string, any> = new Collection();
      if (interaction.options)
        for (const option of interaction.options as any) {
          if (option.type === 'USER') options.set(option.name, { user: option.user, member: option.member });
          else options.set(option.name, option.value);
        }
      module.invoke(interaction, options).catch(e => {
        logger.error(inspect(e, { depth: null }));
        interaction.reply('An error occurred, please try again later.');
      });
    });
  }
}
