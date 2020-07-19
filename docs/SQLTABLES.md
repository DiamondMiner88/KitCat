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
