const pfx = process.env.BOT_PREFIX;

/**
 * Are used in the "category" variable in commands.
 */
module.exports = {
  moderation: {
    help_name: ':no_entry_sign: Moderation',
    help_description: '',
    usage: `\`${pfx}help moderation\``
  },
  fun: {
    help_name: ':smile: Fun',
    help_description: '',
    usage: `\`${pfx}help fun\``
  },
  utils: {
    help_name: ':tools: Utils',
    help_description: '',
    usage: `\`${pfx}help utils\``
  },
  oofcoin: {
    help_name: ':moneybag: Oof coin',
    help_description: '',
    usage: `\`${pfx}help oofcoin\``
  },
  games: {
    help_name: ':game_die: Games',
    help_description: '',
    usage: `\`${pfx}help games\``
  }
};
