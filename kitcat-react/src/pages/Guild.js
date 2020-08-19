import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Snackbar, Tooltip } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

// Components
import { Navbar, GuildSidebar } from '../components';

// Other
import Cookies from 'universal-cookie';
import { FormControlLabel, Switch, Typography } from '@material-ui/core';
import * as commandsData from '../data/commandData';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  content: {
    width: 'calc(100% - 300px)',
    marginLeft: 300
  }
}));

export default function Guild(props) {
  const classes = useStyles();
  const { guildID } = useParams();

  // Data
  const [settings, setSettings] = useState();
  const [commands, setCommands] = useState();

  // Errors
  const [errors, setErrors] = useState([]);
  const [errorsAlertOpened, setErrorsAlertOpened] = useState(false);
  const addError = (error) => {
    setErrors(errors.concat([error]));
    setErrorsAlertOpened(true);
  };

  // Save popup: 'saved_no_popup', 'saved_open_popup', 'unsaved'
  const [saveStatus, setSaveStatus] = useState('saved_no_popup');

  // Menu
  const [currentTab, setCurrentTab] = useState('disable_commands');

  useEffect(() => {
    if (commands || settings) return;
    const cookies = new Cookies();
    if (cookies.get('access-token')) {
      async function fetchData() {
        const res = await fetch('/functions/guild', {
          method: 'POST',
          headers: {
            'access-token': cookies.get('access-token'),
            guild: guildID
          }
        });
        res
          .json()
          .then((json) => {
            if (json.result.message) addError(json.result.message);
            else {
              setCommands(json.result.commands);
              setSettings({}); // Change this later when settings are introduced
            }
          })
          .catch((error) => addError(error.message));
      }
      fetchData();
    } else window.location = process.env.PUBLIC_URL + '#/';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function save() {
    fetch(`/functions/guild`, {
      method: 'POST',
      headers: {
        'access-token': new Cookies().get('access-token'),
        guild: guildID,
        data: JSON.stringify({
          commands: commands
        })
      }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.result.message) addError(json.result.message);
        else setSaveStatus('saved_open_popup');
      })
      .catch((error) => addError(error.message));
  }

  return (
    <div>
      <GuildSidebar onTabChange={setCurrentTab} />
      <Navbar location={props.location} />
      <div className="container">
        <Snackbar
          open={errorsAlertOpened}
          autoHideDuration={null}
          onClose={(event, reason) => {
            if (reason !== 'clickaway') setErrorsAlertOpened(false);
          }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => {
              setErrorsAlertOpened(false);
            }}
            severity="error"
          >
            {errors.map((error) => (
              <div>{error}</div>
            ))}
          </MuiAlert>
        </Snackbar>

        <Snackbar
          open={saveStatus === 'unsaved'}
          autoHideDuration={null}
          onClose={(event, reason) => {
            if (reason !== 'clickaway') {
              save();
              setSaveStatus('no_popup');
            }
          }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={(event, reason) => {
              if (reason !== 'clickaway') {
                save();
                setSaveStatus('no_popup');
              }
            }}
            severity="info"
          >
            You have unsaved settings! Close this to save.
          </MuiAlert>
        </Snackbar>

        <Snackbar
          open={saveStatus === 'saved_open_popup'}
          autoHideDuration={5000}
          onClose={(event, reason) => {
            if (reason !== 'clickaway') setSaveStatus('saved_no_popup');
          }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={(event, reason) => {
              if (reason !== 'clickaway') setSaveStatus('saved_no_popup');
            }}
            severity="success"
          >
            Successfully saved settings!
          </MuiAlert>
        </Snackbar>

        <div className={classes.content}>
          {!commands && !settings && <Typography variant="h4">Loading...</Typography>}

          {errors.length === 0 &&
            currentTab === 'disable_commands' &&
            commands &&
            settings &&
            Object.keys(commands).map((key) => {
              // eslint-disable-next-line array-callback-return
              const cmdData = commandsData.commands.find((cmd) => {
                if (cmd.command === key) return true;
              });
              if (cmdData) {
                return (
                  <Tooltip title={cmdData.help_description}>
                    <FormControl className={classes.formControl}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={commands[key] === 'enabled' ? true : false}
                            color="primary"
                            onChange={(event) => {
                              setCommands({
                                ...commands,
                                [key]: event.target.checked ? 'enabled' : 'disabled'
                              });
                              setSaveStatus('unsaved');
                            }}
                          />
                        }
                        label={key}
                      />
                    </FormControl>
                  </Tooltip>
                );
              } else {
                return (
                  <FormControl className={classes.formControl}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={commands[key] === 'enabled' ? true : false}
                          color="primary"
                          onChange={(event) => {
                            setCommands({
                              ...commands,
                              [key]: event.target.checked ? 'enabled' : 'disabled'
                            });
                            setSaveStatus('unsaved');
                          }}
                        />
                      }
                      label={key}
                    />
                  </FormControl>
                );
              }
            })}

          {errors.length === 0 && currentTab === 'welcomer' && (
            <Typography color="inherit">
              Welcomer: This feature has not been added yet! Coming Soon!
            </Typography>
          )}

          {errors.length === 0 && currentTab === 'leaver' && (
            <Typography color="inherit">
              Leaver: This feature has not been added yet! Coming Soon!
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}
