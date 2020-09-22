const discordmarkdown: [RegExp, string, string][] = [
  [/\*/g, '\\*', 'asterisk'],
  [/\(/g, '\\(', 'parentheses'],
  [/\)/g, '\\)', 'parentheses'],
  [/\[/g, '\\[', 'square bracket'],
  [/\]/g, '\\]', 'square bracket'],
  [/</g, '\\<', 'angle bracket'],
  [/>/g, '\\>', 'angle bracket'],
  [/_/g, '\\_', 'underscore']
];

export default function (string: string) {
  discordmarkdown.forEach(replacement => (string = string.replace(replacement[0], replacement[1])));
  return string;
}