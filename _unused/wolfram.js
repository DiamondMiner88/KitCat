const config = require('../config/config.json');
const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI('3K5593-UJEWH5VHRJ'); //I can just turn this into an environmental variable later. Im gonna need a gitignore on .env files
const fs = require('fs');
var wolframEmbed = new Array();
var embedded = new Array();
var imgresultslimit;

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
  var output;
  var pods;
  pods = queryresult.pods;
  if (pods != undefined) {
    output = pods
      .map((pod) => {
        return getSubpodContent(pod, restype);
      })
      .join('\n');
  }
  return output;
}

function setResultsLimit() {
  var fsjson;
  fs.readFile(__dirname + '/botsettings.json', function (err, data) {
    if (err) throw err;
    fsjson = JSON.parse(data);
    imgresultslimit = parseInt(fsjson['wolfram-image-limit']);
  });
}

module.exports = {
  command: 'wolfram',
  category: require('./_CATEGORIES.js.js').utils,
  help_name: `Wolfram`,
  help_description: `Ask a mathematical or analytical question you want answered.`,
  usage: `wolfram {query}`,
  guildOnly: false,
  unlisted: false,

  execute(message, args) {
    var query = '';
    var textembed = new Array();
    var gbType = 'text';
    setResultsLimit();
    for (var i = 0; i < args.length; i++) {
      //console.log(args[i].toString());
      query = query.concat(args[i].toString() + ' ');
    }

    waApi
      .getFull({
        input: query,
        format: 'plaintext'
      })
      .then((queryresult) => {
        content = getPodContent(queryresult, gbType);
        textembed = {
          color: 0xec0000,
          title: 'Wolfram|Alpha Computing',
          description: 'Natural language query results: ',
          thumbnail: {
            url: 'https://content.wolfram.com/uploads/sites/10/2019/04/Thumb_Mathematica12.png'
          },
          fields: [
            {
              name: 'Your Prompt/Query:',
              value: query
            }
          ]
        };
        if (embedded.length < imgresultslimit) {
          gbType = 'img';
          embedded = [];
          embedded.length = 0;
          return;
        }
        for (var i = 1; i < embedded.length; i++) {
          let nm = embedded[i].podtitle;
          if (!nm.includes('line')) {
            let val = embedded[i].imgsrc;
            if (val === '') {
              val = '\u200b';
              nm = val;
            }
            let fieldJSON = {
              name: nm,
              value: val
            };
            textembed.fields.push(fieldJSON);
          }
        }
        message.channel.send({ embed: textembed });
      })
      .catch(console.error);

    waApi
      .getFull({
        input: query,
        format: 'image'
      })
      .then((queryresult) => {
        //console.log('entering image mode');
        if (!gbType.includes('img')) return;
        content = getPodContent(queryresult, gbType);
        wolframEmbed.push({
          color: 0xec0000,
          title: 'Wolfram|Alpha Computing',
          description: 'Natural language query results: ',
          thumbnail: {
            url: 'https://content.wolfram.com/uploads/sites/10/2019/04/Thumb_Mathematica12.png'
          },
          fields: [
            {
              name: 'Your Prompt/Query:',
              value: query
            }
          ]
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
              url: val
            },
            fields: [
              {
                name: nm,
                value: 'In visual format:'
              }
            ]
          };
          wolframEmbed.push(fullEmbed);
        }
        wolframEmbed.push({
          timestamp: new Date(),
          footer: {
            text: 'Data provided by Wolfram Alpha API',
            icon_url: 'https://www.wolframalpha.com/_next/static/images/share_3G6HuGr6.png'
          }
        });
        for (var i = 0; i < wolframEmbed.length; i++) {
          message.channel.send({ embed: wolframEmbed[i] });
        }
      })
      .catch(console.error);
    wolframEmbed = [];
    embedded = [];
    wolframEmbed.length = 0;
    embedded.length = 0;
  }
};
