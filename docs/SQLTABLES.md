## Image Blacklist
```sql
CREATE TABLE IF NOT EXISTS "image_blacklist" (
  "hash"	TEXT NOT NULL UNIQUE, -- Image's hash
  "guild"	INTEGER NOT NULL, -- Guild id this was banned in
  "user"	INTEGER NOT NULL, -- User id that banned it
  "reason"	TEXT, -- Optional reason
  "url"	INTEGER, -- URL to discord attachment
  PRIMARY KEY("hash")
);
```

## Currency
```sql
CREATE TABLE IF NOT EXISTS "currency" (
	"user"	INTEGER NOT NULL, -- user id
	"bank"	INTEGER NOT NULL DEFAULT 30, -- amnt of coins they have
	"daily_last_claimed_at" INTEGER, -- last claimed thier daily reward at
	PRIMARY KEY("user")
)
```

## Commands
```sql
CREATE TABLE IF NOT EXISTS "commands" (
	"guild"	INTEGER NOT NULL,
	"8ball"	TEXT NOT NULL DEFAULT 'enabled',
	"2048"	TEXT NOT NULL DEFAULT 'enabled',
	"ban"	TEXT NOT NULL DEFAULT 'enabled',
	"sban"	TEXT NOT NULL DEFAULT 'enabled',
	"kick"	TEXT NOT NULL DEFAULT 'enabled',
	"skick"	TEXT NOT NULL DEFAULT 'enabled',
	"purge"	TEXT NOT NULL DEFAULT 'enabled',
	"purgechannel"	TEXT NOT NULL DEFAULT 'enabled',
	"image"	TEXT NOT NULL DEFAULT 'enabled',
	"meme"	TEXT NOT NULL DEFAULT 'enabled',
	"subreddit"	TEXT NOT NULL DEFAULT 'enabled',
	"ping"	TEXT NOT NULL DEFAULT 'enabled',
	"quote"	TEXT NOT NULL DEFAULT 'enabled',
	"roulette"	TEXT NOT NULL DEFAULT 'enabled',
	"soundboard"	TEXT NOT NULL DEFAULT 'enabled',
	"tts"	TEXT DEFAULT 'enabled',
	"trivia"	TEXT DEFAULT 'enabled',
	"wolfram"	TEXT DEFAULT 'enabled',
	"text"	TEXT DEFAULT 'enabled',
	PRIMARY KEY("guild")
);
```
