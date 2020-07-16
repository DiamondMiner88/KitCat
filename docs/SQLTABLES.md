Image Blacklist:
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
