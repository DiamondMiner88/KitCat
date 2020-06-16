const config = require("./config.json");
const pfx = config.prefix;
const blackListImageHash = require("./image-hash-blacklist.json")
const {
  imageHash
} = require('image-hash');

async function testBlacklistImage(message) {
  let url = undefined;
  if (message.attachments.size > 0) {
    url = message.attachments.first().url;
  }
  regex = /http?s:\/\/cdn\.discordapp\.com\/attachments\/.+?(?=\/)\/.+?(?=\/)\/.+/g;
  if (message.content.match(regex)) {
    url = message.content;
  }
  if (url !== undefined) {
    if (url.toLowerCase().indexOf("jpg", url.length - 3) !== -1) {
      imageHash(url, 16, true, (error, hash) => {
        if (error) throw error;
        console.log(hash + " " + url);
        if (blackListImageHash.includes(hash)) {
          message.delete();
        }
      });
    }
    if (url.toLowerCase().indexOf("png", url.length - 3) !== -1) {
      imageHash(url, 16, true, (error, hash) => {
        if (error) throw error;
        console.log(hash + " " + url);
        if (blackListImageHash.includes(hash)) {
          message.delete();
        }
      });
    }
  }
}

module.exports = {
  testBlacklistImage
};
