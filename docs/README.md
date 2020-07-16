# Bot commands

***this is a temporary file, make good webpage doc later***

**All commands must include the prefix in order to be executed**
## Commands
- `8ball {question}` - Ask 8ball a question
- [2048](https://play2048.co/) but in Discord
 - `2048 help` - help page for 2048.
 - `2048 new {optional size: default: 4}` - makes a new guild-wide game.
 - `2048 stop` - ends the guild-wide game.
- `avatar {a mention | username#discriminator}` - retrieves avatar.
- `ban {a mention | username#discriminator} {optional: length in days (0 is perm)} {reason...}` - ban a user. *Logs the ban to #bot-log if it exists*
 - `sban {a mention | username#discriminator} {optional: length in days (0 is perm)} {reason...}` - silently ban a user. *Does not log anything and erases your message*
- `kick {a mention | username#discriminator} {reason...}` - kick a user. *Logs just like the ban command*
 - `skick {a mention | username#discriminator} {reason...}` - silently kick a user. *Does not log anything and erases your message*
- blacklist - **Requires `MANAGE_MESSAGES` permission**   **\*\*WIP\*\***
 - `blacklist help` - lists subcommands for blacklist.
 - blacklist image
   - `blacklist image help` - liists subcommands for `blacklist image`.
   - `blacklist image add {reason...}` - **Must include attachment** blacklists an image from being posted onto the server.
   - `blacklist image list` - Lists blacklisted images.
   - `blakclist image remove` - Removes a image from the blacklist.
- `help` - lists help categories.
- `meme` - gets a meme from r/memes.
- `nhentai {number}` - gets an overview of that number. ***NSFW***
- `ping` - gets the bot's ping
- `purge {optional: default: 5}` bulk-deletes messages under 14 days old (Discord limitation) up to 100 messages at a time.
- `quote` gets a quote from https://quotable.io
- `soundboard {clip}` plays a clip from the available listed using `help soundboard`
- `subreddit {subreddit name}` Gets a top post from that subreddit, will not post the same one twice. **Does not support text-posts yet**
- `tts {text}` Uses Google's Text-to-Speech API to say that text in the VC you are currently in.
- image-commands - add here
- trivia - add here
