/* eslint-disable no-console */
import fs from 'fs';
import { CategoriesData, CategoriesData, Command } from '../commands';
import { commands } from '../bot';

type DataCategory = CategoriesData & { commands: string[] }; // ICategory type + a 'command' field thats a string array
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

CategoriesData.forEach((category: CategoriesData) => {
    // Create a var transforming the ICategory type to a DataCategory type
    const dataCat: DataCategory = { ...category, commands: [] };

    data.categories.push(dataCat);
});

commands.forEach((command) => {
    if (command.unlisted) return;

    // Push command name into the [category].commands
    const catI = data.categories.findIndex((category) => category.name === command.category);
    if (catI) data.categories[catI].commands.push(command.trigger);

    data.commands.push(command);
});

fs.writeFileSync('../../../dashboard/data/commandData.tsx', `module.exports = ${JSON.stringify(data)}`, {
    encoding: 'utf-8',
});
console.log('Finished.');
