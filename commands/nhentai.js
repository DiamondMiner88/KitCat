const config = require("../config.json");
const pfx = config.prefix;
const {
  API
} = require('nhentai-api');
const api = new API();

function tagsToString(tags) {
  var tagStr = "";
  for (const index in tags) tagStr += tags[index].name + " (" + tags[index].count + "), ";
  return tagStr.slice(0, -2);
}

function getOverview(bookID, callback) {
  if (bookID === undefined) return "You did not provide a number!";
  if (!bookID.match(/\d{1,6}/g)) return "That is not a valid number!";
  api.getBook(Number(bookID)).then(book => {
    var parodies = book.tags.filter(tag => tag.type.type === "parody");
    var characters = book.tags.filter(tag => tag.type.type === "character");
    var bookTags = book.tags.filter(tag => tag.type.type === "tag");
    var artists = book.tags.filter(tag => tag.type.type === "artist");
    var groups = book.tags.filter(tag => tag.type.type === "group");
    var lang = book.tags.filter(tag => tag.type.type === "language");
    callback(undefined, `-----------------------------\n<https://nhentai.net/g/${book.id}>\n**Title:** ${book.title.pretty}\n**Parodies:** ${tagsToString(parodies)}\n**Characters:** ${tagsToString(characters)}\n**Tags:** ${tagsToString(bookTags)}\n**Artists:** ${tagsToString(artists)}\n**Groups:** ${tagsToString(groups)}\n**Languages:** ${tagsToString(lang)}\n`);
  }).catch(error => callback("-----------------------------\nBook ID " + bookID + " returned error " + error.message, undefined));
}

module.exports = {
  command: "nhentai",
  category: "utils",
  help_name: `haha nhentai overview`,
  help_description: `Gives title, tags, lang, author ʷʰʸ ᵈᵒᵉˢ ᵗʰᵉ ⁿʰᵉⁿᵗᵃᶦ⁻ᵃᵖᶦ ᵉˣᶦˢᵗ\n\`${pfx}nh {number}\`\nAn alternative is just \`!(number)\``,

  execute(client, message, args) {
    getOverview(args[0], (error, overview) => {
      if (error) message.channel.send(error);
      else message.channel.send(overview);
    });
  },

  getOverview
}