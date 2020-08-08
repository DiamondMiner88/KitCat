import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

// Components
import NavBar from '../components/Navbar';

// Other
import Cookies from 'universal-cookie';
import { FormControlLabel, Switch, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

function Guild(props) {
  const classes = useStyles();
  const { guildID } = useParams();

  const [settings, setSettings] = useState();
  const [commands, setCommands] = useState();

  const [errors, setErrors] = useState([]);
  const [errorsAlertOpened, setErrorsAlertOpened] = useState(false);

  const addError = (error) => {
    setErrors(errors.concat([error]));
    setErrorsAlertOpened(true);
  };

  useEffect(() => {
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
              setSettings({});
            }
          })
          .catch((error) => addError(error.message));
      }
      fetchData();
    } else props.history.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // console.log('commands has changed');
  }, [commands]);

  // function save() {
  //   fetch(`/despacito-spider-626fa/us-central1/guild/${guildID}/save`, {
  //     method: 'GET',
  //     headers: {
  //       'access-token': new Cookies().get('access-token'),
  //       data: {
  //         commands: commands,
  //         settings: settings
  //       }
  //     }
  //   })
  //     .then((res) => res.json())
  //     .then((json) => {
  //       console.log('saved');
  //       console.log(json);
  //       if (json.message) addError(json.message);
  //     })
  //     .catch((error) => addError(error.message));
  // }

  return (
    <div>
      <NavBar location={props.location} history={props.history} />
      <div className="container">
        {errors.length > 0 && (
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
        )}

        {!commands && !settings && <Typography variant="h4">Loading...</Typography>}

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
  );
}

export default Guild;
