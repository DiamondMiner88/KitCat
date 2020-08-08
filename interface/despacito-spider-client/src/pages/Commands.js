import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Components
import NavBar from '../components/Navbar';
import commands from '../data/commands';

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
  const cmds = require('../data/commands');
  const commands = cmds.commands;
  const cmdObj = Object.keys(commands);
  return (
    <div className={classes.root}>
      <NavBar location={props.location} history={props.history} />
      <div className="container">
        {cmdObj.map(item => {
          return (<h1>{item}</h1>);
        })}
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

function RenderArray() {
  const cmds = require('../data/commands');
  const commands = cmds.commands;
  for (var item in commands) {
  }
}

export default Commands;
