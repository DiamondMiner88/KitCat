const sqlite3 = require('sqlite3').verbose();

const image_blacklist_tbl = `
CREATE TABLE IF NOT EXISTS "image_blacklist" (
  "hash" TEXT NOT NULL UNIQUE,
  "guild" INTEGER NOT NULL,
  "user" INTEGER NOT NULL,
  "reason" TEXT,
  "url"	INTEGER,
  PRIMARY KEY("hash")
);
`;

const currency_tbl = `
CREATE TABLE IF NOT EXISTS "currency" (
	"user" INTEGER NOT NULL,
	"bank" INTEGER NOT NULL DEFAULT 30,
	"last_claimed_at" INTEGER,
	PRIMARY KEY("user")
);
`;

const users_tbl = `
CREATE TABLE IF NOT EXISTS "users" (
    "guild" INTEGER NOT NULL,
    "user" INTEGER NOT NULL,
    "warns" INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY("guild","user")
);
`;

const settings_tbl = `
CREATE TABLE IF NOT EXISTS "settings" (
	"guild"	INTEGER NOT NULL,
	"commands"	TEXT NOT NULL,
	"prefix"	TEXT NOT NULL DEFAULT 'k!',
	"dmTextEnabled"	INTEGER NOT NULL DEFAULT 0,
	"dmText"	TEXT NOT NULL DEFAULT '',
	PRIMARY KEY("guild")
);
`;

const db = new sqlite3.Database(
  './data.db',
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) console.error(err.message);
    else console.info('Connected to data.db!');
  }
);

db.run(image_blacklist_tbl, [], (err) => {
  if (err) console.log(`Error creating table: ${err}`);
});

db.run(currency_tbl, [], (err) => {
  if (err) console.log(`Error creating table: ${err}`);
});

db.run(users_tbl, [], (err) => {
  if (err) console.log(`Error creating table: ${err}`);
});

db.run(settings_tbl, [], (err) => {
  if (err) console.log(`Error creating table: ${err}`);
});
exports.acceptableCmds = {
  ban: 1,
  kick: 1,
  meme: 1,
  nhentai: 1,
  nsfw: 1,
  purge: 1,
  purgechannel: 1,
  say: 1,
  sban: 1,
  serverinfo: 1,
  skick: 1,
  submission: 1,
  tts: 1,
  warn: 1
};
exports.addGuildToSettings = async (guildID) => {
  const sql = 'INSERT OR IGNORE INTO settings (guild, commands) VALUES(?, ?)';
  this.run(sql, [guildID, JSON.stringify(this.acceptableCmds)], (err) => {
    if (err) {
      console.error(err.message);
      Promise.reject(err.message);
    } else Promise.resolve();
  });
};

exports.checkForProfile = function (user) {
  this.run('INSERT OR IGNORE INTO currency (user) VALUES(?)', [user.id], (err) => {
    if (err) console.error(err.message);
  });
};

// Use this instead of db.run() if we need statistics later we can modify this to also record the call
exports.run = (sql, params, callback) => db.run(sql, params, (err) => callback(err));

exports.db = db;
