import React from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Cookies from 'universal-cookie';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Toolbar from '@material-ui/core/Toolbar';

// Icon imports
import CodeIcon from '@material-ui/icons/Code';
import HomeIcon from '@material-ui/icons/Home';
import StorageIcon from '@material-ui/icons/Storage';

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

export default function Sidebar(props) {
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
              href="/"
              style={{ textDecoration: 'none' }}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </List>
          <List>
            <ListItem
              button
              key="commands_page"
              component={Link}
              href="/commands"
              style={{ textDecoration: 'none' }}
            >
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
              <ListItemText primary="Commands" />
            </ListItem>
          </List>

          {new Cookies().get('access-token') && (
            <List>
              <ListItem
                button
                key="guilds_list"
                component={Link}
                href="/guilds"
                style={{ textDecoration: 'none' }}
              >
                <ListItemIcon>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText primary="Guilds" />
              </ListItem>
            </List>
          )}

          <Divider />

          {GetRecentServers()}

          <List></List>
        </div>
      </Drawer>
    </div>
  );
}

function GetRecentServers() {
  const cookies = new Cookies();
  const recentServers = cookies.get('recent-servers');

  if (recentServers && recentServers.length > 6) {
    recentServers = recentServers.splice(6);
    cookies.set('recent-servers', recentServers, {
      path: '/',
      maxAge: 10 * 365 * 24 * 60 * 60, // 10 years is good enough as a permenant cookie
      sameSite: 'strict',
      overwrite: true
    });
  }

  return recentServers ? (
    <div>
      <ListSubheader>Recent Servers</ListSubheader>
      {recentServers.map((item) => {
        return (
          <List>
            <ListItem
              button
              key={item.id}
              component={Link}
              href={`/guild/${item.id}`}
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

  // const cookies = new Cookies();
  // if (cookies.get('recent-servers') === undefined && cookies.get('access-token') !== undefined) {
  //   cookies.set('recent-servers', []);
  //   return;
  // }
  // if (cookies.get('recent-servers').length === 0) {
  //   return;
  // }
  // if (cookies.get('recent-servers').length > 6) {
  //   cookies.set('recent-servers', cookies.get('recent-servers').splice(6));
  // }
  // if (recentServers && cookies.get('access-token')) {
  //   return (
  //     <div>

  //     </div>
  //   );
  // }
}
