import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Sidebar from '../components/GuildSidebar';

// Components
import NavBar from '../components/Navbar';

const commands = {"🎲 Games":[{"command":"2048","help_name":"🔢 2048","help_description":"Play 2048 in Discord","usage":"2048 help","guildOnly":true}],"😄 Fun":[{"command":"8ball","help_name":"🎱 8Ball","help_description":"Ask it a question, and it will give you an answer.","usage":"8ball {Your Question}","guildOnly":false},{"command":"doggo","help_name":"🐶 Doggo","help_description":"Get a photo of a doggo using this command!","usage":"doggo {optional: breed | example: retriever}","guildOnly":false},{"command":"image","help_name":"📷 Photo Commands","help_description":"Run photo commands to make custom photos.","usage":"image help","guildOnly":false},{"command":"meme","help_name":"😂 Memes","help_description":"Get a meme from r/memes","usage":"meme","guildOnly":false},{"command":"nsfw","help_name":"😏 NSFW","help_description":"Get NSFW photos, and gifs.","usage":"nsfw help","guildOnly":false},{"command":"quote","help_name":"😇 Inspirational Quote","help_description":"Gives an inspirational quote!","usage":"quote","guildOnly":false},{"command":"say","help_name":":speaking_head: Say","help_description":"Make the bot say whatever you want!","usage":"say {message}","guildOnly":false},{"command":"subreddit","help_name":"🌐 Subreddit","help_description":"Get a top post from a subreddit! (NSFW subreddits allowed in NSFW channels)","usage":"subreddit {Subreddit name}","guildOnly":false},{"command":"trivia","help_name":"❓ Trivia","help_description":"Asks a trivia question!. If you get the question right, you earn oof coins, if you get it wrong, you loose oofcoins.\nRun `oof trivia help` for help with the trivia command.","usage":"trivia {optional: difficulty} {optional: category}","guildOnly":false}],":tools: Utils":[{"command":"avatar","help_name":"Avatar","help_description":"Get avatar of the user after the command. Can be a mention or a tag.","usage":"avatar {mention | user tag}","guildOnly":false},{"command":"help","help_name":"Help","help_description":"What you're looking at right now.","usage":"help","guildOnly":false},{"command":"nhentai","help_name":"nHentai","help_description":"Gives an overview of the nHentai code.","usage":"nhentai {number} ` or `{number}","guildOnly":false},{"command":"ping","help_name":"Ping","help_description":"Gets my latency and API latency.","usage":"ping","guildOnly":false},{"command":"server","help_name":"Server","help_description":"Gives information on the server. Information: Server size (with and without bots), and the date server was created.","usage":"server","guildOnly":false},{"command":"tts","help_name":":robot: TTS","help_description":"Joins VC and says what you want it to say!","usage":"tts {text}","guildOnly":true}],"💰 Oof coin":[{"command":"balance","help_name":"Oof coin Balance","help_description":"Gets the your or the mention user's global balance of oof coin.","usage":"balance {optional: mention | username#discriminator}","guildOnly":false}],"🚫 Moderation":[{"command":"ban","help_name":"⛔ Ban","help_description":"Used to ban members.","usage":"ban {mention | username#discriminator} {optional: reason}","guildOnly":true},{"command":"blacklist","help_name":"Blacklist commands","help_description":"For more commands on the blacklist do","usage":"blacklist help","guildOnly":true},{"command":"kick","help_name":":leg: Kick","help_description":"Used to kick members.","usage":"kick {mention | username#discriminator} {optional: reason}","guildOnly":true},{"command":"purge","help_name":"🗑️ Purge","help_description":"Used to delete messages in bulk.","usage":"purge {amount: default = 5}","guildOnly":false},{"command":"purgechannel","help_name":"🗑️ Purge Channel","help_description":"Used to delete to wipe all messages in a channel. ***This command deletes and makes a new channel in the exact same spot***","usage":"purgechannel","guildOnly":true},{"command":"sban","help_name":"⛔ Silent ban","help_description":"Used to silently ban members.","usage":"sban {mention | username#discriminator} {optional: reason}","guildOnly":true},{"command":"skick","help_name":":leg: Silent kick","help_description":"Used to silently kick members.","usage":"skick {mention | username#discriminator} {optional: reason}","guildOnly":true}]};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  Accordion: {
    backgroundColor: '#f1f1f1f2'
  },
  code: {
    backgroundColor: '#f2f2f2',
    color: '#e83e8c'
  },
  background: {
    backgroundColor: 'white'
  }
}));

function Commands(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <NavBar location={props.location} history={props.history} />
      <Sidebar />
      <div className="container">
        {GetCommands()}
      </div>
    </div>
  );
  
}

function MakeAccordion(title, text, id, code, perms) {
  /*
  title - required
  text - required
  id - required
  code - required
  perms - optional
  */

  const classes = useStyles();

  if (perms === undefined) {
    return (
      <Accordion className={classes.Accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={id + '-content'}
          id={id + '-header'}
        >
          <Typography className={classes.heading}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.background}>
          <Typography>
            {text}
            <br></br>
            <strong>Usage</strong>
            <br></br>
            <code className={classes.code}>{'oof ' + code}</code>
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Accordion className={classes.Accordion}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={id + '-content'}
        id={id + '-header'}
      >
        <Typography className={classes.heading}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.background}>
        <Typography>
          {text}
          <br></br>
          <strong>Usage</strong>
          <br></br>
          <code className={classes.code}>{'oof ' + code}</code>
          <br></br>
          <strong>Permissions</strong>
          <br></br>
          {perms}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

function GetCommands() {
  const prefix = 'oof';
  return(
    <div>
      {Object.keys(commands).map((item) => {
        console.log(commands[item])
        return (
          <div>
            <h2>{item}</h2>
            <div>
              {commands[item].map((commandItem) => {
                console.log(commandItem)
                return (
                  <div>
                    {MakeAccordion(commandItem.help_name, commandItem.help_description, commandItem.command, prefix + commandItem.usage)}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Commands;
