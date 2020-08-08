/*
  return (
    <div className={classes.root}>
      <NavBar location={props.location} history={props.history} />
      <div className="container">
        <h2>Moderation</h2>
        <div className={classes.root}>
          {MakeAccordion('Ban', 'Used to ban members.', 'ban', 'ban {mention | username#discriminator} {optional: reason}', 'Ban Members')}
          {MakeAccordion('Blacklist Commands', 'Blacklist things.', 'blacklist', 'blacklist help', 'Manage Messages')}
          {MakeAccordion('Kick', 'Used to kick members.', 'kick',  'kick {mention | username#discriminator} {optional: reason}', 'Kick Members')}
          {MakeAccordion('Purge', 'Used to delete messages.', 'purge', 'purge {amount: default = 5}', 'Manage Messages')}
          {MakeAccordion('Purge Channel',
                        'Used to delete all messages in a channel. <i>This comamnd deletes and makes</i> a new channel in the same spot.',
                        'purgechannel', 'purgechannel', 'Manage Messages')}
          {MakeAccordion('Silent Ban', 'Used to silently ban members. (Doesn\'t show in chat)', 'sban', 
                        'sban {mention | username#discriminator} {optional: reason}', 'Ban Members')}
          {MakeAccordion('Silent Kick', 'Used to silently kick members.', 'skick', 'skick {mention | username#discriminator} {optional: reason}',
                        'Kick Members')}              
        </div>
        <h2>Fun</h2>
        <div className={classes.root}>
          {MakeAccordion('8Ball', 'Ask it a question, and it will give you an answer',
                         'eightball', '8ball {question}')}
          {MakeAccordion('Doggo', 'Get a photo of a doggo using this command!',
                         'doggo', 'doggo {optional: breed | example: retriever}')}
          {MakeAccordion('Photo Commands', 'Run photo commands to make custom photos. (Only 1 so far)', 'photocmd',
                         'image help')}
          {MakeAccordion('Memes', 'Get a meme from r/memes', 'memes', 'meme')}
          {MakeAccordion('Inspirational Quote', 'Gives an inspirational quote!', 'iquote', 'quote')}
          {MakeAccordion('Say', 'Make the bot say whatever you want!', 'say', 'say {message}')}
          {MakeAccordion('Subreddit', 'Get a top post from a subreddit! (NSFW subreddits allowed in NSFW channels)', 'subreddit',
                         'subreddit {subreddit name}')}
          {MakeAccordion('Trivia', 'Asks a trivia question!. If you get the question right, you earn oof coins, if you get it wrong, you loose oofcoins.\
                         <br> Run <code>oof trivia help</code> for help with the trivia command.', 'trivia',
                         'trivia {optional: difficulty} {optional: category}')}
        </div>
        <h2>Utils</h2>
        <div className={classes.root}>
          {MakeAccordion('Avatar', 'Get avatar of the user after the command. Can be a mention or a tag.', 'avatar',
                         'avatar {mention | user tag}')}
          {MakeAccordion('Help', 'The help command', 'help', 'help')}
          {MakeAccordion('Ping', 'Gets latency and API latency of the bot.', 'ping', 'ping')}
          {MakeAccordion('TTS', 'Joins a VC and says what you want it to say.', 'tts', 'tts {text}')}
          {MakeAccordion('Wolfram', 'Ask a mathematical or analytical question you want answered.', 'wolfram',
                         'wolfram {query}')}
        </div>
        <h2>Oof Coin</h2>
        <div className={classes.root}>
          {MakeAccordion('Oof Coin Balance', "Gets the your or the mention user's global balance of oof coin.", 'ocbal',
                         'oof balance {optional: mention | username#discriminator}')}
        </div>
        <h2>Games</h2>
        <div className={classes.root}>
          {MakeAccordion('2048', 'Play 2048 in Discord.', 'twozerofoureight', '2048 help')}
        </div>
      </div>
    </div>
  );*/