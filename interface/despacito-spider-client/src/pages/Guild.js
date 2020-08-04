import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NavBar from '../components/Navbar';
import Cookies from 'universal-cookie';

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
  const [modified, setModified] = useState({
    commands: {},
    settings: {}
  });
  const { guildID } = useParams();

  useEffect(() => {
    const cookies = new Cookies();
    if (cookies.get('access-token') !== undefined) {
      async function fetchData() {
        const res = await fetch('/despacito-spider-626fa/us-central1/guild/' + guildID, {
          method: 'GET',
          headers: {
            'token-type': 'Bearer',
            'access-token': cookies.get('access-token')
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
        if (json.message) setErrors(errors.concat([json.message]));
        else {
          console.log(json);
          setModified({
            commands: {},
            settings: {}
          });
        }
      })
      .catch((error) => {
        setErrors(errors.concat([error.message]));
      });
  }

  return (
    <div>
      {errors.length === 0 ? (
        <NavBar location={props.location} history={props.history} />
      ) : (
        ((<h2>Errors:</h2>), errors.map((error) => <div>{error}</div>))
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
