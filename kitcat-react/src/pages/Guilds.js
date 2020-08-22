import React from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Typography
} from '@material-ui/core';

// Components
import { Navbar, GuildSidebar } from '../components';

// Other
import Cookies from 'universal-cookie';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  avatar: {
    width: 120,
    height: 120
  },
  cardSubComponents: {
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  card: {
    marginBottom: theme.spacing(2),
    border: '1px black',
    borderStyle: 'solid'
  }
}));

export default function Guilds(props) {
  const classes = useStyles();

  const [guilds, setGuilds] = React.useState();

  React.useEffect(() => {
    const cookies = new Cookies();
    if (cookies.get('access-token')) {
      async function fetchData() {
        const res = await fetch('https://parseapi.back4app.com/functions/guild', {
          method: 'POST',
          headers: {
            'X-Parse-Application-Id': process.env.REACT_APP_PARSE_ID,
            'X-Parse-Javascript-Key': process.env.REACT_APP_PARSE_JS_KEY
          },
          body: JSON.stringify({ 'access-token': cookies.get('access-token') })
        });
        res
          .json()
          .then((json) => {
            if (json.result.message) console.log(json.message);
            else setGuilds(json.result.guilds);
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
      fetchData();
    } else window.location = process.env.PUBLIC_URL + '#/';
  }, []);

  const guildsComponents = () => {
    const guildComponentList = [];
    for (const guildID in guilds) {
      guildComponentList.push(
        <Card className={(classes.root, classes.card)}>
          <CardActionArea
            onClick={() => {
              const cookies = new Cookies();
              let recentServers = cookies.get('recent-servers')
                ? cookies.get('recent-servers')
                : [];

              let currentGuildData = guilds[guildID];
              currentGuildData.id = guildID;

              if (!recentServers.some((elem) => elem.id === currentGuildData.id))
                recentServers.unshift(currentGuildData);

              if (recentServers.length > 6) recentServers = recentServers.slice(0, 6);

              cookies.set('recent-servers', recentServers, {
                path: '/',
                maxAge: 604000,
                sameSite: 'strict',
                overwrite: true
              });

              window.location = process.env.PUBLIC_URL + `#/guild/${guildID}`;
            }}
          >
            <CardHeader
              className={classes.cardSubComponents}
              avatar={
                <Avatar className={classes.avatar}>
                  <img
                    src={guilds[guildID].iconURL}
                    alt={`Guild Icon for ${guilds[guildID].name}`}
                  />
                </Avatar>
              }
            />
            <CardContent className={classes.cardSubComponents}>
              <Typography style={{ textTransform: 'none', fontSize: 30 }}>
                {guilds[guildID].name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      );
    }
    return guildComponentList;
  };

  return (
    <div>
      <Navbar location={props.location} />
      <GuildSidebar />
      <div className="container">
        {guilds ? guildsComponents() : <Typography>Loading...</Typography>}
      </div>
    </div>
  );
}
