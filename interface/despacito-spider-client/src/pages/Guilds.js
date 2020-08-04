import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Cookies from 'universal-cookie';
import { json } from 'body-parser';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

function Guilds(props) {
  const classes = useStyles();
  const [guilds, setGuilds] = useState();

  useEffect(() => {
    const cookies = new Cookies();
    if (cookies.get('access-token') !== undefined) {
      async function fetchData() {
        const res = await fetch('/despacito-spider-626fa/us-central1/guilds', {
          method: 'GET',
          headers: {
            'access-token': cookies.get('access-token')
          }
        });
        res
          .json()
          .then((json) => {
            if (json.message) console.log(json.message);
            else setGuilds(json);
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
      fetchData();
    } else props.history.push('/');
  }, []);

  return (
    <div>
      {JSON.stringify(guilds)}
      {guilds.map(guild => <li>{guild.id}</li>)}
    </div>
  );
}

export default Guilds;
