import React from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Cookies from 'universal-cookie';
import Drawer from '@material-ui/core/Drawer';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';

// Icon imports
import StorageIcon from '@material-ui/icons/Storage';
import WarningIcon from '@material-ui/icons/Warning';

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
          {new Cookies().get('access-token') && (
            <List>
              <ListItem
                button
                key="guilds"
                component={Link}
                href="/guilds"
                className={classes.link}
              >
                <ListItemIcon>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText primary="Guilds" />
              </ListItem>
            </List>
          )}
          <List>
            <ListItem button key="status" component={Link} href="/status" className={classes.link}>
              <ListItemIcon>
                <WarningIcon />
              </ListItemIcon>
              <ListItemText primary="Status" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
}
