console.log('It will say "Connected to data.db!" This is normal.');

import fs from 'fs';
import { categories, ICategory, Command } from '../commands/CommandBase';
import { commands, registerCommands } from '../commands';
registerCommands();

type DataCategory = ICategory & { commands: string[] }; // ICategory type + a 'command' field thats a string array
type DataCommand = Pick<
    Command,
    'executor' | 'category' | 'display_name' | 'description' | 'usage' | 'guildOnly' | 'nsfw'
>; // Remove certain properties from Command to make an optimized type

const data: {
    commands: DataCommand[];
    categories: DataCategory[];
} = {
    commands: [],
    categories: [],
};

categories.forEach((category: ICategory) => {
    // Create a var transforming the ICategory type to a DataCategory type
    const dataCat: DataCategory = { ...category, commands: [] };

    data.categories.push(dataCat);
});

commands.forEach((command) => {
    if (command.unlisted) return;

    // Push command name into the [category].commands
    const catI = data.categories.findIndex((category) => category.name === command.category);
    if (catI) data.categories[catI].commands.push(command.executor);

    data.commands.push(command);
});

console.log(data);
fs.writeFileSync('./commands.json', JSON.stringify(data), { encoding: 'utf-8' });
console.log('Wrote to /build/util/commands.json');
