const config = require("./config.json");
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')

const image_blacklist_tbl = `
CREATE TABLE IF NOT EXISTS "image_blacklist" (
  "hash"	TEXT NOT NULL UNIQUE,
  "guild"	INTEGER NOT NULL,
  "user"	INTEGER NOT NULL,
  "reason"	TEXT,
  "url"	INTEGER,
  PRIMARY KEY("hash")
);`;

const currency_tbl = `
CREATE TABLE IF NOT EXISTS "currency" (
	"user"	INTEGER NOT NULL,
	"purse"	INTEGER NOT NULL DEFAULT 50,
	"bank"	INTEGER NOT NULL DEFAULT 0,
	"loan_left"	INTEGER,
	"loan_due"	INTEGER,
	PRIMARY KEY("user")
);`;

var db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) console.error(err.message);
});

db.run(image_blacklist_tbl, [], (err) => {
  if (err) console.log(`Error creating image_blacklist_tbl: ${err}`);
});

db.run(currency_tbl, [], (err) => {
  if (err) console.log(`Error creating currency_tbl: ${err}`);
});

module.exports = {
  db,
}
