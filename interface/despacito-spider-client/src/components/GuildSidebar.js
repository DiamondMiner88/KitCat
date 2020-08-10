import React, { useState, useEffect } from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListIcon from '@material-ui/icons/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';

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
  toolbar: theme.mixins.toolbar
}));

function Sidebar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
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
            <ListItem button key="guild_dashboard">
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary="Guild Overview" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key="test">
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary="test" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
}

export default Sidebar;
