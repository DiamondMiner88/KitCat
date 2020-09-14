import React from 'react';
import { useParams } from 'react-router-dom';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  Snackbar,
  Tooltip,
  Button,
  FormLabel,
  FormHelperText,
  TextField
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

// Components
import { Navbar, GuildSidebar, CookieConsent } from '../components';

// Other
import Cookies from 'universal-cookie';
import { FormControlLabel, Switch, Typography } from '@material-ui/core';
import * as commandsData from '../data/commandData';
import { ReactIsInDevelomentMode } from '../functions';

const useStyles = makeStyles((theme) => ({
  content: {
    width: 'calc(100% - 300px)',
    marginLeft: 300
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  formLabel: {
    marginBottom: theme.spacing(2)
  },
  textField: {
    width: 700
  }
}));

export default function Guild(props) {
  const classes = useStyles();
  const { guildID } = useParams();

  // Data
  const [settings, setSettings] = React.useState();

  // Errors
  const [errors, setErrors] = React.useState([]);
  const addError = (error) => {
    setErrors(errors.concat([error]));
  };

  // Save popup: 'saved_no_popup', 'saved_open_popup', 'unsaved'
  const [saveStatus, setSaveStatus] = React.useState('saved_no_popup');

  // Menu
  const [currentTab, setCurrentTab] = React.useState('disable_commands');

  // dmOnjoin text error
  const [dmOnJoinError, setDmOnJoinError] = React.useState(null);

  React.useEffect(() => {
    if (settings) return;
    const cookies = new Cookies();
    if (cookies.get('access-token')) {
      async function fetchData() {
        const res = await fetch('https://parseapi.back4app.com/functions/guild', {
          method: 'POST',
          headers: {
            'X-Parse-Application-Id': process.env.REACT_APP_PARSE_ID,
            'X-Parse-Javascript-Key': process.env.REACT_APP_PARSE_JS_KEY
          },
          body: JSON.stringify({
            'access-token': cookies.get('access-token'),
            guild: guildID,
            env: ReactIsInDevelomentMode() ? 'development' : 'production'
          })
        });
        res
          .json()
          .then((json) => {
            if (json.result.message) addError(json.result.message);
            else setSettings(json.result);
          })
          .catch((error) => addError(error.message));
      }
      fetchData();
    } else window.location = process.env.PUBLIC_URL + '#/';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function save() {
    fetch(`https://parseapi.back4app.com/functions/guild`, {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': process.env.REACT_APP_PARSE_ID,
        'X-Parse-Javascript-Key': process.env.REACT_APP_PARSE_JS_KEY
      },
      body: JSON.stringify({
        'access-token': new Cookies().get('access-token'),
        env: ReactIsInDevelomentMode() ? 'development' : 'production',
        guild: guildID,
        settings: JSON.stringify(settings)
      })
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
      <CookieConsent />
      <Navbar location={props.location} />
      <GuildSidebar onTabChange={setCurrentTab} />

      <div className="container">
        <Snackbar open={errors.length > 0} autoHideDuration={null}>
          <Alert elevation={6} variant="filled" severity="error" action={null}>
            {errors.map((error) => (
              <div>{error}</div>
            ))}
          </Alert>
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
          <Alert
            elevation={6}
            variant="filled"
            onClose={(event, reason) => {
              if (reason !== 'clickaway') {
                save();
                setSaveStatus('no_popup');
              }
            }}
            severity="info"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  save();
                  setSaveStatus('no_popup');
                }}
              >
                SAVE
              </Button>
            }
          >
            You have unsaved settings!
          </Alert>
        </Snackbar>

        <Snackbar
          open={saveStatus === 'saved_open_popup'}
          autoHideDuration={5000}
          onClose={(event, reason) => {
            if (reason !== 'clickaway') setSaveStatus('saved_no_popup');
          }}
        >
          <Alert
            elevation={6}
            variant="filled"
            onClose={(event, reason) => {
              if (reason !== 'clickaway') setSaveStatus('saved_no_popup');
            }}
            severity="success"
          >
            Successfully saved settings!
          </Alert>
        </Snackbar>

        <div className={classes.content}>
          {!settings && <Typography variant="h4">Loading...</Typography>}

          {errors.length === 0 && currentTab === 'disable_commands' && settings && (
            <FormControl className={classes.formControl}>
              <FormLabel>Enable/Disable commands</FormLabel>
              {Object.keys(settings.commands).map((key) => {
                const cmdData = commandsData.commands.find((cmd) => cmd.command === key);
                return cmdData ? (
                  <Tooltip title={cmdData.help_description}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Boolean(settings.commands[key])}
                          color="primary"
                          onChange={(event) => {
                            setSettings({
                              ...settings,
                              commands: {
                                ...settings.commands,
                                [key]: event.target.checked ? 1 : 0
                              }
                            });
                            setSaveStatus('unsaved');
                          }}
                        />
                      }
                      label={key}
                    />
                  </Tooltip>
                ) : (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(settings.commands[key])}
                        color="primary"
                        onChange={(event) => {
                          setSettings({
                            ...settings,
                            commands: {
                              ...settings.commands,
                              [key]: event.target.checked ? 1 : 0
                            }
                          });
                          setSaveStatus('unsaved');
                        }}
                      />
                    }
                    label={key}
                  />
                );
              })}
              <FormHelperText>
                Additional switches may be found in their respective sidebar tab.
              </FormHelperText>
            </FormControl>
          )}

          {errors.length === 0 && currentTab === 'welcomer' && settings && (
            <Typography color="inherit">
              Welcomer: This feature has not been added yet! Coming Soon!
            </Typography>
          )}

          {errors.length === 0 && currentTab === 'leaver' && settings && (
            <Typography color="inherit">
              Leaver: This feature has not been added yet! Coming Soon!
            </Typography>
          )}

          {errors.length === 0 && currentTab === 'dmOnJoin' && settings && (
            <div>
              <FormControl className={classes.formControl}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.dmTextEnabled === 1}
                      color="primary"
                      onChange={(event) => {
                        setSettings({
                          ...settings,
                          dmTextEnabled: event.target.checked ? 1 : 0
                        });
                        setSaveStatus('unsaved');
                      }}
                    />
                  }
                  label="DM new members"
                />
              </FormControl>
              <br />
              <br />
              <Typography color="inherit" style={{ fontSize: '16px' }}>
                DM new members
              </Typography>
              <TextField
                error={dmOnJoinError}
                className={classes.textField}
                placeholder={
                  ' __**Welcome to Example Server!**__\n Here is our website: https://example.com\n Put your rules and other server info here'
                }
                defaultValue={settings.dmText}
                multiline
                rows={15}
                rowsMax={Infinity}
                variant="filled"
                disabled={settings.dmTextEnabled !== 1}
                helperText={dmOnJoinError}
                onChange={(event) => {
                  if (event.target.value.length > 2000)
                    setDmOnJoinError('Messages cannot be longer than 2000 characters.');
                  else {
                    setDmOnJoinError(null);
                    setSettings({ ...settings, dmText: event.target.value });
                    setSaveStatus('unsaved');
                  }
                }}
              />
            </div>
          )}

          {errors.length === 0 && currentTab === 'other' && settings && (
            <TextField
              label="Prefix"
              InputLabelProps={{
                shrink: true
              }}
              defaultValue={settings.prefix}
              onChange={(event) => {
                setSettings({ ...settings, prefix: event.target.value });
                setSaveStatus('unsaved');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
