import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NavBar from '../components/_Navbar';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

function Guild(props) {
  const classes = useStyles();
  const [errors, setErrors] = useState([]);
  const [settings, setSettings] = useState();
  const [commandSettings, setCommandSettings] = useState({});
  const [modified, setModified] = useState({});
  const { guildID } = useParams();

  useEffect(() => {
    const query = new URLSearchParams(props.location.search);
    if (!query.has('token_type') && !query.has('access_token')) {
      props.history.push('/');
      return;
    }
    async function fetchData() {
      const res = await fetch('/despacito-spider-626fa/us-central1/guild/' + guildID, {
        method: 'GET',
        headers: {
          'token-type': query.get('token_type'),
          'access-token': query.get('access_token')
        }
      });
      res
        .json()
        .then((json) => {
          if (json.message) setErrors(errors.concat([json.message]));
          setCommandSettings(json.commands);
        })
        .catch((error) => {
          setErrors(errors.concat([error.message]));
        });
    }
    fetchData();
  }, []);

  const setCommandMode = (event, command) => {
    console.log(event);
  };

  return (
    <div>
      {errors.length === 0 ? (
        <NavBar location={props.location} history={props.history} />
      ) : (
        errors.map((error) => <div>{error}</div>)
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
                    const tmp = modified;
                    tmp[key] = event.target.value;
                    setModified(tmp);
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
