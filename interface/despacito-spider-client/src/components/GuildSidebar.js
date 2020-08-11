import React, { useState, useEffect } from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Toolbar from '@material-ui/core/Toolbar';
import { Link, Avatar } from '@material-ui/core';
import Cookies from 'universal-cookie';
import ListSubheader from '@material-ui/core/ListSubheader';

// Icon imports
import HomeIcon from '@material-ui/icons/Home';

import CodeIcon from '@material-ui/icons/Code';

import StorageIcon from '@material-ui/icons/Storage';

import ListIcon from '@material-ui/icons/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

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
                <HomeIcon />  
              </ListItemIcon>
              <ListItemText primary="Home"/>
            </ListItem>
          </List>
          <List>
            <ListItem button key="commands_page" component={Link} href="/commands" style={{ textDecoration: 'none' }}>
              <ListItemIcon>
                <CodeIcon />  
              </ListItemIcon>
              <ListItemText primary="Commands"/>
            </ListItem>
          </List>
          {GuildsList()}
          <Divider />

          {GetRecentServers()}

          <List>
          </List>
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
            <StorageIcon />  
          </ListItemIcon>
          <ListItemText primary="Guilds"/>
        </ListItem>
      </List>
    );
  }
}

function GetRecentServers() {
  const cookies = new Cookies();
  if (cookies.get('recent-servers') === undefined  && cookies.get('access-token') !== undefined) {
    cookies.set('recent-servers', []);
    return;
  }
  if (cookies.get('recent-servers').length === 0) {
    return;
  }
  if (cookies.get('recent-servers').length > 6) {
    cookies.set('recent-servers', cookies.get('recent-servers').splice(6))
  }
  if (cookies.get('recent-servers') !== undefined && cookies.get('access-token') !== undefined) {
    return (
      <div>
        {cookies.get('recent-servers').map((item) => {
          return (
            <div>
              <ListSubheader>Recent Servers</ListSubheader>
              <List>
                <ListItem button key={item.id} component={Link} href={`/guild/${item.id}`} style={{textDecoration: 'none'}}>
                  <ListItemIcon>
                    <Avatar alt={item.name} src={item.iconURL}></Avatar>
                  </ListItemIcon>
                  <ListItemText primary={item.name}/>
                </ListItem>
              </List>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Sidebar;
