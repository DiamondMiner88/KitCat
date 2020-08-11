import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Sidebar from '../components/GuildSidebar';
import { Alert, AlertTitle } from '@material-ui/lab';

// Components
import NavBar from '../components/Navbar';

const commands =  require('../data/commands').commands;
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

function GetCommands() {
  const classes = useStyles();
  return (
    <div>
      {Object.keys(commands).map((item) => {
        return (
          <div>
            <h2>{item}</h2>
            <div className={classes.root}>
              {commands[item].map((commandItem) => {
                return (
                  <div>
                    {MakeAccordion(commandItem.help_name, commandItem.help_description, commandItem.command, commandItem.usage)}
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
