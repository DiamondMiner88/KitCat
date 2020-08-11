import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

// Components
import NavBar from '../components/Navbar';
import Sidebar from '../components/GuildSidebar';

// Other
import Cookies from 'universal-cookie';
import { FormControlLabel, Switch, Typography } from '@material-ui/core';

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

function Guild(props) {
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

  useEffect(() => {
    if (commands || settings) return;
    const cookies = new Cookies();
    if (cookies.get('access-token') !== undefined) {
      async function fetchData() {
        const res = await fetch('/despacito-spider-626fa/us-central1/guild/' + guildID, {
          method: 'GET',
          headers: {
            'access-token': cookies.get('access-token')
          }
        });
        res
          .json()
          .then((json) => {
            if (json.message) addError(json.message);
            else {
              setCommands(json.commands);
              setSettings({}); // Change this later when settings are introduced
            }
          })
          .catch((error) => addError(error.message));
      }
      fetchData();
    } else props.history.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function save() {
    fetch(`/despacito-spider-626fa/us-central1/guild/${guildID}/save`, {
      method: 'GET',
      headers: {
        'access-token': new Cookies().get('access-token'),
        data: JSON.stringify({
          commands: commands
        })
      }
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.message) addError(json.message);
        else setSaveStatus('saved_open_popup');
      })
      .catch((error) => addError(error.message));
  }

  return (
    <div>
      <Sidebar />
      <NavBar location={props.location} history={props.history} />
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
          autoHideDuration={null}
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

        {!commands && !settings && <Typography variant="h4">Loading...</Typography>}

        <div className={classes.content}>
          {errors.length === 0 &&
            commands &&
            settings &&
            Object.keys(commands).map((key) => {
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
            })}
        </div>
      </div>
    </div>
  );
}

export default Guild;
