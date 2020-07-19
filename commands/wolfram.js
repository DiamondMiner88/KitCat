const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");
const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI('3K5593-UJEWH5VHRJ'); //I can just turn this into an environmental variable later. Im gonna need a gitignore on .env files
const Discord = require('discord.js');
var wolframEmbed = new Array();
var embeddedimg = new Array();

function embedData (src, podtitle) {
    this.imgsrc = src;
    this.podtitle = podtitle;
}
function getSubpodContent (pod) {
    const subpodContent = pod.subpods.map(subpod => {
        embeddedimg.push(new embedData(subpod.img.src, pod.title));
        console.log(embeddedimg[embeddedimg.length-1].podtitle);
        console.log(embeddedimg[embeddedimg.length-1].imgsrc);
    });
    return embeddedimg[embeddedimg.length-1];
}

function getPodContent (queryresult) {
    var output;
    var pods;
    pods = queryresult.pods;
    output = pods.map((pod) => {
        return getSubpodContent(pod);
    }).join('\n');
    return output;
}

module.exports = {
  command: "wolfram",
  category: categories.utils,
  help_name: `oof wolfram [query]`,
  help_description: `Ask a mathematical or analytical question you want answered`,

  execute(client, message, args) {
    var query = "";
    for(var i = 0; i < args.length; i++) {
      console.log(args[i].toString());
      query = query.concat(args[i].toString()+' ');
    }
    waApi.getFull(query).then((queryresult) => {
        content = getPodContent(queryresult);
        wolframEmbed.push ({
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
            }
          ]
       });
       for(var i = 1; i < embeddedimg.length; i++) {
         let nm = embeddedimg[i].podtitle;
         let val = embeddedimg[i].imgsrc;
         let fullEmbed = {
           color: 0xec0000,
           image: {
            url: val
           },
           fields: [
            {
              name: nm,
              value: 'In visual format:'
            }
           ],
         };
         wolframEmbed.push(fullEmbed);
       }
       wolframEmbed.push({	
         timestamp: new Date(),
         footer: {
          text: 'Data provided by Wolfram Alpha API',
          icon_url: 'https://www.wolframalpha.com/_next/static/images/share_3G6HuGr6.png',
         }
       });
       for(var i = 0; i < wolframEmbed.length; i++) {
         message.channel.send({embed:wolframEmbed[i]});
       }
    }).catch(console.error); 
    wolframEmbed = [];
    embeddedimg = [];
    wolframEmbed.length = 0;
    embeddedimg.length = 0;
  }
}
