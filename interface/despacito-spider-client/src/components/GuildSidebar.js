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
import { Link } from '@material-ui/core';
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
            <ListItem button key="home_page" component={Link} href="/" style={{ textDecoration: 'none' }}>
              <ListItemIcon>
                <ListIcon />  
              </ListItemIcon>
              <ListItemText primary="Home"/>
            </ListItem>
          </List>
          <List>
            <ListItem button key="commands_page" component={Link} href="/commands" style={{ textDecoration: 'none' }}>
              <ListItemIcon>
                <ListIcon />  
              </ListItemIcon>
              <ListItemText primary="Commands"/>
            </ListItem>
          </List>
            {GuildsList()}
          <Divider />
        </div>
      </Drawer>
    </div>
  );
}

function GuildsList() {
  const cookies = new Cookies();
  if (cookies.get('access-token') !== undefined) {
    return (
      <List>
        <ListItem button key="guilds_list" component={Link} href="/guilds" style={{ textDecoration: 'none' }}>
          <ListItemIcon>
            <ListIcon />  
          </ListItemIcon>
          <ListItemText primary="Guilds"/>
        </ListItem>
      </List>
    );
  }
}

export default Sidebar;


/*
          <List>
            <ListItem button key="test">
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary="test" />
            </ListItem>
          </List>
                    <List>
            <ListItem button key="guild_dashboard" onClick={() => console.log('Guild Overview')}>
              <ListItemIcon>
                <ListIcon />  
              </ListItemIcon>
              <ListItemText primary="Guild Overview" />
            </ListItem>
          </List>
          <Divider />
*/