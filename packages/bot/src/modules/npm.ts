import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Module, ModuleCategory, OptionString } from '../modules';
import { logger } from '../logging';
import { msToUI } from '../utils';
import dateFormat from 'dateformat';
import fetch from 'node-fetch';

export default class extends Module {
  name = 'npm';
  description = "Fetch a package and display it's info from npm.";
  category = ModuleCategory.UTILITY;
  guildOnly = false;

  options: any = [
    {
      type: 'STRING',
      name: 'package',
      description: 'Package name.',
      required: true,
      default: undefined,
      choices: undefined,
      options: undefined
    }
  ];

  async invoke(interaction: CommandInteraction, { package: { value } }: { package: OptionString }): Promise<any> {
    let pkg: any = fetch('https://registry.npmjs.org/' + value).then(res => res.json());
    try {
      pkg = await pkg;
    } catch (e) {
      logger.warning(`Failed to fetch info from npm: ${e}`);
      return interaction.reply('Failed to fetch data from the npm registry. Try again later.');
    }
    if (pkg.error) return interaction.reply(pkg.error);

    const totalDLs = await fetch(`https://api.npmjs.org/downloads/point/1000-01-01:3000-01-01/${value}`)
      .then(r => r.json())
      .then(r => r.downloads)
      .catch(() => undefined);

    const formatString = 'yyyy-mm-dd HH:MM:ss';
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const created = new Date(pkg.time.created).getTime() + timezoneOffset;
    const modified = new Date(pkg.time.modified).getTime() + timezoneOffset;
    const embed = new MessageEmbed()
      .setAuthor('npm', 'https://authy.com/wp-content/uploads/npm-logo.png')
      .setTitle(pkg.name)
      .setURL(`https://www.npmjs.com/package/` + pkg._id)
      .setDescription(pkg.description)
      .addField('❯ Latest Version', pkg['dist-tags'].latest, true)
      .addField('❯ Total Downloads', totalDLs ? totalDLs : 'Unknown', true);
    if (pkg.author?.name)
      embed.addField('❯ Author', pkg.author.url ? `[${pkg.author.name}](${pkg.author.url})` : pkg.author.name, true);
    embed
      .addField(
        '❯ Created',
        `${dateFormat(created, formatString)}\n(${msToUI(Date.now() + timezoneOffset - created)} Ago)`,
        true
      )
      .addField(
        '❯ Last Modified',
        `${dateFormat(modified, formatString)}\n(${msToUI(Date.now() + timezoneOffset - modified)}) Ago`,
        true
      )
      .addField(
        '❯ Links',
        `• [Homepage](${pkg.homepage})\n${
          pkg.repository?.url ? `• [Repository](${pkg.repository.url.replace('git+', '')})` : ''
        }\n${pkg.bugs?.url ? `• [Issues](${pkg.bugs.url})` : ''}`,
        true
      )
      .addField('❯ Maintainers', '• ' + pkg.maintainers.map((m: any) => m.name).join('\n• '), true);
    interaction.reply(embed);
  }
}
