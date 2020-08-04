import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Cookies from 'universal-cookie';
import { json } from 'body-parser';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import NavBar from '../components/Navbar';
import { CardHeader, Avatar } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120
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
  // const guildsArr = [];
  const guildItems = [];

  for (var guild in guilds) {
    // guildsArr.push({[guild]: guilds[guild]})
    guildItems.push(
      <Card className={classes.root}>
      <div>
        <CardHeader
          avatar = {
            <Avatar className={classes.avatar}><img src={guilds[guild].iconURL}/></Avatar>
          } style={{display: 'inline-block', verticalAlign: 'middle'}}
        />
        <CardContent style={{display: 'inline-block', verticalAlign: 'middle'}}>
          <Button variant="h5" component="h2" style={{textTransform: 'none', fontSize: 30}}>
            {guilds[guild].name}
          </Button>
        </CardContent>
      </div>
    </Card>
    )
  }
  return (
    <div>
      <NavBar location={props.location} history={props.history} />
      <div className="container">
        {guildItems}
      </div>
    </div>
  );
}

export default Guilds;
