const sqlite3 = require('sqlite3').verbose();

const image_blacklist_tbl = `
CREATE TABLE IF NOT EXISTS "image_blacklist" (
  "hash" TEXT NOT NULL UNIQUE,
  "guild" INTEGER NOT NULL,
  "user" INTEGER NOT NULL,
  "reason" TEXT,
  "url"	INTEGER,
  PRIMARY KEY("hash")
);`;

const currency_tbl = `
CREATE TABLE IF NOT EXISTS "currency" (
	"user" INTEGER NOT NULL,
	"bank" INTEGER NOT NULL DEFAULT 30,
	"last_claimed_at" INTEGER,
	PRIMARY KEY("user")
);`;

const commands_tbl = `
CREATE TABLE IF NOT EXISTS "commands" (
	"guild"	INTEGER NOT NULL,
	"2048" TEXT NOT NULL DEFAULT 'enabled',
	"8ball"	TEXT NOT NULL DEFAULT 'enabled',
	"avatar" TEXT NOT NULL DEFAULT 'enabled',
	"ban" TEXT NOT NULL DEFAULT 'enabled',
	"cat" TEXT NOT NULL DEFAULT 'enabled',
	"doggo" TEXT NOT NULL DEFAULT 'enabled',
	"image" TEXT NOT NULL DEFAULT 'enabled',
	"kick" TEXT NOT NULL DEFAULT 'enabled',
	"meme" TEXT NOT NULL DEFAULT 'enabled',
	"ping" TEXT NOT NULL DEFAULT 'enabled',
	"purge" TEXT NOT NULL DEFAULT 'enabled',
	"purgechannel" TEXT NOT NULL DEFAULT 'enabled',
	"quote"	TEXT NOT NULL DEFAULT 'enabled',
	"roulette" TEXT NOT NULL DEFAULT 'enabled',
	"say" TEXT NOT NULL DEFAULT 'enabled',
	"sban" TEXT NOT NULL DEFAULT 'enabled',
	"skick"	TEXT NOT NULL DEFAULT 'enabled',
	"soundboard" TEXT NOT NULL DEFAULT 'enabled',
	"subreddit"	TEXT NOT NULL DEFAULT 'enabled',
	"trivia" TEXT DEFAULT 'enabled',
	"tts" TEXT DEFAULT 'enabled',
	"wolfram" TEXT DEFAULT 'enabled',
	PRIMARY KEY("guild")
);`;

var db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) console.error(err.message);
  else console.info('Connected to data.db!')
});

db.run(image_blacklist_tbl, [], (err) => {
  if (err) console.log(`Error creating table: ${err}`);
});

db.run(currency_tbl, [], (err) => {
  if (err) console.log(`Error creating table: ${err}`);
});

db.run(commands_tbl, [], (err) => {
  if (err) console.log(`Error creating table: ${err}`);
});

module.exports = {
  db,
  checkForProfile(user) {
    db.run('INSERT OR IGNORE INTO currency (user) VALUES(?)', [user.id], (err) => {
      if (err) console.log('Error trying to add currency profile for user: ' + err);
    });
  }
};
