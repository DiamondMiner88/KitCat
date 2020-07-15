const config = require("./config.json");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')

const image_blacklist = `
CREATE TABLE IF NOT EXISTS "image_blacklist" (
  "hash"	TEXT NOT NULL UNIQUE,
  "guild"	INTEGER NOT NULL,
  "user"	INTEGER NOT NULL,
  "reason"	TEXT,
  "url"	INTEGER,
  PRIMARY KEY("hash")
);
`

var db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) console.error(err.message);
});

db.run(image_blacklist, [], (err) => {
  if (err) console.log(`Error creating image_blacklist: ${err}`);
});

module.exports = {
  db,
}
