// @ts-nocheck
import Discord from 'discord.js';
import { IGuildSettings } from '../cache';
import { Command } from './CommandBase';
import * as fs from 'fs';
import { default as WolframAlphaAPI } from 'wolfram-alpha-api';

const waApi = WolframAlphaAPI('3K5593-UJEWH5VHRJ');

let wolframEmbed = new Array();
let embedded = new Array();
const imgresultslimit = 100;

function embedData(src, podtitle) {
    this.imgsrc = src;
    this.podtitle = podtitle;
}
function getSubpodContent(pod, restype) {
    const subpodContent = pod.subpods.map((subpod) => {
        if (restype.includes('img')) embedded.push(new embedData(subpod.img.src, pod.title));
        else if (restype.includes('text')) embedded.push(new embedData(subpod.plaintext, pod.title));
    });
    return embedded[embedded.length - 1];
}

function getPodContent(queryresult, restype) {
    let output;
    let pods;
    pods = queryresult.pods;
    if (pods !== undefined) {
        output = pods
            .map((pod) => {
                return getSubpodContent(pod, restype);
            })
            .join('\n');
    }
    return output;
}

export class Wolfram extends Command {
    executor = 'wolfram';
    category = 'util';
    display_name = `Bot's Ping`;
    description = `Ask a mathematical or analytical question you want answered.`;
    usage = '{query}';
    guildOnly = false;
    unlisted = true;
    nsfw = false;

    async run(message: Discord.Message, args: string[], settings: IGuildSettings) {
        const query = args.join(' ');
        var textembed = new Array();
        var gbType = 'text';

        waApi
            .getFull({
                input: query,
                format: 'plaintext',
            })
            .then((queryresult) => {
                const content = getPodContent(queryresult, gbType);
                textembed = {
                    color: 0xec0000,
                    title: 'Wolfram|Alpha Computing',
                    description: 'Natural language query results: ',
                    thumbnail: {
                        url: 'https://content.wolfram.com/uploads/sites/10/2019/04/Thumb_Mathematica12.png',
                    },
                    fields: [
                        {
                            name: 'Your Prompt/Query:',
                            value: query,
                        },
                    ],
                };
                if (embedded.length < imgresultslimit) {
                    gbType = 'img';
                    embedded = [];
                    embedded.length = 0;
                    return;
                }
                for (const i = 1; i < embedded.length; i++) {
                    let nm = embedded[i].podtitle;
                    if (!nm.includes('line')) {
                        let val = embedded[i].imgsrc;
                        if (val === '') {
                            val = '\u200b';
                            nm = val;
                        }
                        textembed.fields.push({
                            name: nm,
                            value: val,
                        });
                    }
                }
                message.channel.send({ embed: textembed });
            })
            .catch(console.error);

        waApi
            .getFull({
                input: query,
                format: 'image',
            })
            .then((queryresult) => {
                if (!gbType.includes('img')) return;
                const content = getPodContent(queryresult, gbType);
                wolframEmbed.push({
                    color: 0xec0000,
                    title: 'Wolfram|Alpha Computing',
                    description: 'Natural language query results: ',
                    thumbnail: {
                        url: 'https://content.wolfram.com/uploads/sites/10/2019/04/Thumb_Mathematica12.png',
                    },
                    fields: [
                        {
                            name: 'Your Prompt/Query:',
                            value: query,
                        },
                    ],
                });
                for (var i = 1; i < embedded.length; i++) {
                    let nm = embedded[i].podtitle;
                    let val = embedded[i].imgsrc;
                    if (val === '') {
                        val = '\u200b';
                        nm = val;
                    }
                    let fullEmbed = {
                        color: 0xec0000,
                        image: {
                            url: val,
                        },
                        fields: [
                            {
                                name: nm,
                                value: 'In visual format:',
                            },
                        ],
                    };
                    wolframEmbed.push(fullEmbed);
                }
                wolframEmbed.forEach((embed) => message.channel.send({ embed }));
            })
            .catch(console.error);
        wolframEmbed = [];
        embedded = [];
        wolframEmbed.length = 0;
        embedded.length = 0;
    }
}
