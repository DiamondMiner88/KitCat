import React from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Divider,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar
} from '@material-ui/core';
import {
  EmojiPeople as WavingPersonIcon,
  Home as HomeIcon,
  MeetingRoom as OpenDoorIcon,
  ToggleOff as ToggleOffIcon,
  SmsFailed as SmsFailedIcon,
  Settings as SettingsIcon
} from '@material-ui/icons';

// Other
import Cookies from 'universal-cookie';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  drawer: {
    width: 300,
    flexShrink: 0
  },
  drawerPaper: {
    width: 300
  },
  drawerContainer: {
    overflow: 'auto'
  },
  toolbar: theme.mixins.toolbar,
  link: {
    textDecoration: 'none'
  }
}));

export default function GuildSidebar(props) {
  const classes = useStyles();

  return (
    <div position="fixed" className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem
              button
              key="home_page"
              component={Link}
              href={process.env.PUBLIC_URL + '#/'}
              className={classes.link}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </List>

          <Divider />

          <List>
            <ListItem
              button
              key="disable_commands"
              component={Link}
              className={classes.link}
              onClick={() => {
                props.onTabChange('disable_commands');
              }}
            >
              <ListItemIcon>
                <ToggleOffIcon />
              </ListItemIcon>
              <ListItemText primary="Disable Commands" />
            </ListItem>
          </List>

          <List>
            <ListItem
              button
              key="welcomer"
              component={Link}
              className={classes.link}
              onClick={() => {
                props.onTabChange('welcomer');
              }}
            >
              <ListItemIcon>
                <OpenDoorIcon />
              </ListItemIcon>
              <ListItemText primary="Welcomer" />
            </ListItem>
          </List>

          <List>
            <ListItem
              button
              key="welcomer"
              component={Link}
              className={classes.link}
              onClick={() => {
                props.onTabChange('leaver');
              }}
            >
              <ListItemIcon>
                <WavingPersonIcon />
              </ListItemIcon>
              <ListItemText primary="Leaver" />
            </ListItem>
          </List>

          <List>
            <ListItem
              button
              key="dmOnJoin"
              component={Link}
              className={classes.link}
              onClick={() => {
                props.onTabChange('dmOnJoin');
              }}
            >
              <ListItemIcon>
                <SmsFailedIcon />
              </ListItemIcon>
              <ListItemText primary="DM on join" />
            </ListItem>
          </List>

          <List>
            <ListItem
              button
              key="other"
              component={Link}
              className={classes.link}
              onClick={() => {
                props.onTabChange('other');
              }}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Other settings" />
            </ListItem>
          </List>

          {GetRecentServers()}
        </div>
      </Drawer>
    </div>
  );
}

function GetRecentServers() {
  let recentServers = new Cookies().get('recent-servers');

  return recentServers ? (
    <div>
      <Divider />
      <ListSubheader>Recent Servers</ListSubheader>
      {recentServers.map((item) => {
        return (
          <List>
            <ListItem
              button
              key={item.id}
              component={Link}
              href={process.env.PUBLIC_URL + `#/guild/${item.id}`}
              style={{ textDecoration: 'none' }}
            >
              <ListItemIcon>
                <Avatar alt={item.name} src={item.iconURL}></Avatar>
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          </List>
        );
      })}
    </div>
  ) : null;
}
