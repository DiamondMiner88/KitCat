import {
  ApplicationCommand,
  ApplicationCommandOption,
  CommandInteraction,
  GuildChannel,
  GuildMember,
  PermissionResolvable,
  Role,
  User
} from 'discord.js';

export abstract class Module {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly category: ModuleCategory;
  abstract readonly options: ApplicationCommandOption[];
  /**
   * Whether this command works only in servers
   */
  abstract readonly guildOnly: boolean;
  /**
   * Whether this command needs access to the database
   */
  readonly requiresDb: boolean = false;
  /**
   * Whether this command requires it to run in only nsfw channels
   */
  readonly nsfw: boolean = false;
  /**
   * Prevents the command from being used, and removes the command from registered slashies if it exists already
   */
  readonly unlisted: boolean = false;
  /**
   * Array of permissions / single permission the user needs in order to use the command
   */
  readonly userPermissions?: PermissionResolvable;
  /**
   * Whether the client needs more permissions other than MANAGE_MESSAGES in the server
   */
  readonly advancedPermissions?: boolean;

  /**
   * Set at runtime when fetching slashies
   */
  command?: ApplicationCommand;

  abstract invoke(interaction: CommandInteraction, options: Record<string, any>): Promise<any>;
}

export class ModuleCategory {
  static readonly all: ModuleCategory[] = [];

  static readonly UTILITY = new ModuleCategory('utility', 'Interact with APIs for easy access.');
  static readonly MODERATION = new ModuleCategory('moderation', 'Help you manage your server.');
  static readonly GENERAL = new ModuleCategory('general', "Anything that doesn't fit in the above two categories.");

  private constructor(public name: string, public description: string) {
    ModuleCategory.all.push(this);
  }
}

export interface BaseOption {
  name: string;
}

export interface OptionString extends BaseOption {
  type: 'STRING';
  value: string;
}

export interface OptionInteger extends BaseOption {
  type: 'INTEGER';
  value: number;
}

export interface OptionBool extends BaseOption {
  type: 'BOOLEAN';
  value: boolean;
}

export interface OptionUser extends BaseOption {
  type: 'USER';
  user: User;
  member?: GuildMember;
}

export interface OptionChannel extends BaseOption {
  type: 'CHANNEL';
  channel: GuildChannel;
}

export interface OptionRole extends BaseOption {
  type: 'ROLE';
  value: Role;
}
