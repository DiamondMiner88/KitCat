import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Module, ModuleCategory, OptionString } from '../modules';
import { defaultLogger } from '../logging';
import { link, makeKVList, makeList, timestamp } from '../utils';
import fetch from 'node-fetch';
import shortNumber from 'short-number';

//#region NPM Registry typings
export interface NpmInfo {
  _id: string;
  _rev: string;
  name: string;
  'dist-tags': StringProperty;
  versions: Record<string, NpmVersion>;
  time: StringProperty;
  maintainers: NpmMaintainer[];
  description: string;
  homepage: string;
  keywords: string[];
  repository: NpmRepository;
  author?: NpmAuthor | string;
  bugs: NpmBug;
  license: string;
  readme: string;
  readmeFilename: string;
}

export interface NpmAuthor {
  name?: string;
  email?: string;
  url?: string;
}

export interface NpmBug {
  url: string;
}

export interface NpmDist {
  integrity: string;
  shasum: string;
  tarball: string;
  fileCount: number;
  unpackedSize: number;
  'npm-signature': string;
}

export interface NpmMaintainer {
  name: string;
  email: string;
}

export interface NpmRepository {
  type: string;
  url: string;
}

export interface NpmVersion {
  name: string;
  version: string;
  description: string;
  main: string;
  types: string;
  scripts: StringProperty;
  repository: NpmRepository;
  keywords: string[];
  author: NpmAuthor;
  license: string;
  bugs: NpmBug;
  homepage: string;
  dependencies: StringProperty;
  devDependencies: StringProperty;
  gitHead: string;
  _id: string;
  _nodeVersion: string;
  _npmVersion: string;
  dist: NpmDist;
  maintainers: NpmMaintainer[];
  _npmUser: NpmMaintainer;
  directories: Record<string, unknown>;
  _npmOperationalInternal: _npmOperationalInternal;
  _hasShrinkwrap: boolean;
}

export interface StringProperty {
  [key: string]: string;
}

export interface _npmOperationalInternal {
  host: string;
  tmp: string;
}
//#endregion

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
    const pkg = await fetch('https://registry.npmjs.org/' + value)
      .then(res => res.json() as Promise<NpmInfo>)
      .catch(() => undefined);
    if (!pkg) {
      defaultLogger.warning(`Failed to fetch data from npm registry`);
      return interaction.reply('Failed to fetch data from the npm registry. Try again later.');
    }

    //@ts-expect-error Check for api errors
    if (pkg.error) return interaction.reply(pkg.error);

    const dlsURL = `https://api.npmjs.org/downloads/point/1000-01-01:3000-01-01/${value}`;
    const totalDLs = await fetch(dlsURL)
      .then(r => r.json())
      .then(r => r.downloads as number)
      .catch(() => undefined);

    const embed = new MessageEmbed()
      .setAuthor('npm', 'https://authy.com/wp-content/uploads/npm-logo.png')
      .setTitle(pkg.name)
      .setURL(`https://www.npmjs.com/package/` + pkg._id)
      .setDescription(pkg.description)
      .addField(
        '❯ Info',
        makeKVList(
          ['Latest Version', pkg['dist-tags'].latest, true],
          ['Downloads', link(totalDLs ? shortNumber(totalDLs) : 'Unknown', dlsURL), true],
          [
            'Author',
            pkg.author
              ? typeof pkg.author === 'string'
                ? pkg.author
                : pkg.author.url
                ? `[${pkg.author.name}](${pkg.author.url})`
                : pkg.author.name
              : 'Unknown',
            true,
            !!pkg.author
          ],
          ['License', pkg.license, true]
        ) +
          '\n' +
          makeList(
            [link('Homepage', pkg.homepage), !!pkg.homepage],
            [link('Repository', pkg.repository?.url?.replace('git+', '')), !!pkg.repository?.url],
            [link('Issues', pkg.bugs?.url), !!pkg.bugs?.url]
          ),
        true
      );
    embed
      .addField('❯ Created', timestamp(pkg.time.created, { newLine: true }), true)
      .addField('❯ Last Modified', timestamp(pkg.time.modified, { newLine: true }), true)
      .addField('❯ Dependencies', Object.keys(pkg.versions[pkg['dist-tags'].latest].dependencies).join(', '))
      .addField('❯ Maintainers', pkg.maintainers.map(m => m.name).join(', '));

    interaction.reply({ embeds: [embed] });
  }
}
