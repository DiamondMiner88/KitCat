const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");
const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI('3K5593-UJEWH5VHRJ'); //I can just turn this into an environmental variable later. Im gonna need a gitignore on .env files
var wolframEmbed;
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
    console.log(output);
    return output;
}

module.exports = {
  command: "wolframalpha",
  category: categories.utils,
  help_name: `oof wolfram [query]`,
  help_description: `Ask a mathematical or analytical question you want answered`,

  execute(client, message, args) {
    var content;
    var inlinefields;
    var query = message.toString().toLower();
    waApi.getFull(query).then((queryresult) => {
        content = getPodContent(queryresult);
        wolframEmbed = {
          color: 0x0099ff,
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
            {
              name: '\u200b',
              value: '\u200b',
              inline: false
            },
          ],
          image: {
            url: 'https://i.imgur.com/wSTFkRM.png',
          },
          timestamp: new Date(),
          footer: {
            text: 'Info provided by Wolfram|Alpha API',
            icon_url: 'https://www.wolframalpha.com/_next/static/images/share_3G6HuGr6.png',
          },
       };
       for(var i = 0; i < embeddedimg.length; i++) {
         let nm = embeddedimg[i].podtitle;
         let val = embeddedimg[i].imgsrc;
         wolframEmbed.fields.push({name: `${nm}`, image: `{url: ${val}}`, inline:true});
       }
       message.channel.send({embed:wolframEmbed});
    }).catch(console.error); 
  }
}
