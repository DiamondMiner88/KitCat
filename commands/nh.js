const config = require("../config.json");
const pfx = config.prefix;
const {
  API, Tag
} = require('nhentai-api');
const api = new API();

function tagsToString(tags) {
  var tagStr = "";
  for (const index in tags) {
    tagStr += tags[index].name + " (" + tags[index].count + "), ";
  }
  return tagStr.slice(0, -2);
}

module.exports = {
  command: "nh",
  category: "utils",
  help_name: `haha nhentai overview`,
  help_description: `Gives title, tags, lang, author ʷʰʸ ᵈᵒᵉˢ ᵗʰᵉ ⁿʰᵉⁿᵗᵃᶦ⁻ᵃᵖᶦ ᵉˣᶦˢᵗ\n\`${pfx}nh {number}\``,

  execute(client, message, args) {
    if (args[0] != undefined) {
      if (args[0].match(/\d{1,6}/g)) {
        api.getBook(Number(args[0])).then(book => {

          var parodies = book.tags.filter(tag => tag.type.type === "parody");
          var characters = book.tags.filter(tag => tag.type.type === "character");
          var bookTags = book.tags.filter(tag => tag.type.type === "tag");
          var artists = book.tags.filter(tag => tag.type.type === "artist");
          var groups = book.tags.filter(tag => tag.type.type === "group");
          var lang = book.tags.filter(tag => tag.type.type === "language");

          message.channel.send(`<https://nhentai.net/g/${book.id}>\n**Title:** ${book.title.pretty}\n**Parodies:** ${tagsToString(parodies)}\n**Characters:** ${tagsToString(characters)}\n**Tags:** ${tagsToString(bookTags)}\n**Artists:** ${tagsToString(artists)}\n**Groups:** ${tagsToString(groups)}\n**Languages:** ${tagsToString(lang)}\n`);
          return;
        }).catch(error => message.channel.send(error.message));
      }
      else message.channel.send("That is not a valid number!");
    }
    else message.channel.send("You did not provide a number!");
  }
}
