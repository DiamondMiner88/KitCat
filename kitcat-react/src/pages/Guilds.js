import React, { useState, useEffect } from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

// Components
import NavBar from '../components/Navbar';
import GuildSidebar from '../components/GuildSidebar';

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
  }
}));

export default function Guilds(props) {
  const classes = useStyles();

  const [guilds, setGuilds] = useState();

  useEffect(() => {
    const cookies = new Cookies();
    if (cookies.get('access-token') !== undefined) {
      async function fetchData() {
        const res = await fetch('/functions/guilds', {
          method: 'POST',
          headers: {
            'access-token': cookies.get('access-token')
          }
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
    } else props.history.push('/');
  }, [props.history]);

  const guildsComponents = () => {
    const guildComponentList = [];
    for (const guildID in guilds) {
      guildComponentList.push(
        <Card className={classes.root}>
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
                maxAge: 10 * 365 * 24 * 60 * 60, // 10 years is good enough as a permenant cookie
                sameSite: 'strict',
                overwrite: true
              });

              props.history.push(`/guild/${guildID}`);
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
      <NavBar location={props.location} history={props.history} />
      <GuildSidebar />
      <div className="container">
        {guilds ? guildsComponents() : <Typography>Loading...</Typography>}
      </div>
    </div>
  );
}
