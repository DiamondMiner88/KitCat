import React from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

// Components
import { Navbar, HomeSidebar } from '../components';

// Other
import commandData from '../data/commandData';

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

export default function Commands(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Navbar location={props.location} />
      <HomeSidebar />
      <div className="container">{GetCommands()}</div>
    </div>
  );
}

function Command(title, text, id, code, perms) {
  /**
   * title - required
   * text  - required
   * id    - required
   * code  - required
   * perms - optional
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
      {commandData.categories.map((cat) => {
        return (
          <div>
            <h2>{cat.help_name}</h2>
            <div className={classes.root}>
              {cat.commands.map((cmdName) => {
                const cmd = commandData.commands.find((cmd) => cmd.command === cmdName);
                return (
                  <div>{Command(cmd.help_name, cmd.help_description, cmd.command, cmd.usage)}</div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
