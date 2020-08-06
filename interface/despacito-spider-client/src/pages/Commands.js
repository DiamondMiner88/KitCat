import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Components
import NavBar from '../components/Navbar';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
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
  const classes = useStyles()
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
          {MakeAccordion('Soundboard', 'Play audio clips. Run <code>oof soundboard help</code> for help with audio clips.', 'soundboard',
                         'soundboard {audio clip}')}
        </div>
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

  const classes = useStyles()

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
    )
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
  )
}

export default Commands;
