import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MuiAlert from '@material-ui/lab/Alert';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';

// Components
import NavBar from '../components/Navbar';

// Other
import Cookies from 'universal-cookie';

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
  const [commandSettings, setCommandSettings] = useState({});
  const [modified, setModified] = useState({
    commands: {},
    settings: {}
  });

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
            else setCommandSettings(json.commands);
          })
          .catch((error) => addError(error.message));
      }
      fetchData();
    } else props.history.push('/');
  }, []);

  function save() {
    const cookies = new Cookies();
    fetch('/despacito-spider-626fa/us-central1/guild/' + guildID + '/save', {
      method: 'GET',
      headers: {
        'access-token': cookies.get('access-token'),
        data: modified
      }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.message) addError(json.message);
        else {
          setModified({
            commands: {},
            settings: {}
          });
        }
      })
      .catch((error) => addError(error.message));
  }

  return (
    <div>
      <NavBar location={props.location} history={props.history} />

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

      {errors.length === 0 && (
        <div className="container">
          {Object.keys(commandSettings).map((key) => {
            return (
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="grouped-select">{key}</InputLabel>
                <Select
                  defaultValue={commandSettings[key]}
                  id="grouped-select"
                  onChange={(event) => {
                    let tmp = modified;
                    tmp.commands[key] = event.target.value;
                    setModified(tmp);
                    // save();
                  }}
                >
                  <MenuItem value="enabled">Enabled</MenuItem>
                  <MenuItem value="disabled">Disabled</MenuItem>
                </Select>
              </FormControl>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Guild;
