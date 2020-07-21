const config = require("../config.json");
const pfx = config.prefix;
const categories = require("./_CATEGORIES.js");
const fs = require('fs');
var fsjson = {};
var fscontent;
fs.readFile(__dirname+'/botsettings.json', function(err, data) {
  if(err) throw err;
  fsjson = JSON.parse(data);
  //console.log("fsjson"+fsjson);
  return;
});

function changeSetting (setting, value) {
  fsjson[setting] = value;
  fscontent = JSON.stringify(fsjson);
  //console.log(fscontent);
  fs.writeFile(__dirname+'/botsettings.json', fscontent, function(err, data) {
    if(err) throw err;
    return;
  });
}

module.exports = {
  command: "adjust_setting",
  category: categories.utils,
  help_name: `adjust_setting`,
  help_description: `adjust one of the listed bot settings: \n-Wolfram image result limit`,

  execute(client, message, args) {
    var concenatedargs = "";
    var settingsdata = [];
    for(var i = 0; i < args.length; i++) 
      concenatedargs = concenatedargs.concat(args[i]);
    settingsdata = concenatedargs.split(':');
    //console.log(concenatedargs);
    changeSetting(settingsdata[0], settingsdata[1]);
  }
}
