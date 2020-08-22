import React, { useState, useEffect } from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Link from '@material-ui/core/Link';
import Skeleton from '@material-ui/lab/Skeleton';
import ToolBar from '@material-ui/core/ToolBar';
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

// Other
import Cookies from 'universal-cookie';
import fetch from 'node-fetch';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  spacer: {
    flex: '1 1 auto'
  },
  elements: {
    paddingRight: theme.spacing(3)
  }
}));

export default function Navbar(props) {
  const classes = useStyles();
  const [hasToken, setHasToken] = useState(false);
  const [user, setUser] = useState();

  //User drop down
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const anchorRef = React.useRef(null);
  const handleToggle = () => setUserDropdownOpen((prevOpen) => !prevOpen);
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setUserDropdownOpen(false);
  };
  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setUserDropdownOpen(false);
    }
  }
  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(setUserDropdownOpen);
  React.useEffect(() => {
    if (prevOpen.current === true && setUserDropdownOpen === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = setUserDropdownOpen;
  }, [setUserDropdownOpen]);
  const userDropdown = () => {
    return (
      <div className={classes.root}>
        <Popper
          open={userDropdownOpen}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={userDropdownOpen}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem
                      onClick={(event) => {
                        handleClose(event);
                        // Remove all cookies
                        document.cookie.split(';').forEach((c) => {
                          document.cookie = c
                            .replace(/^ +/, '')
                            .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
                        });
                        document.location.reload();
                      }}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  };

  useEffect(() => {
    const cookies = new Cookies();
    if (cookies.get('access-token') !== undefined) {
      setHasToken(true);
      fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `Bearer ${cookies.get('access-token')}`
        }
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.message) window.location = process.env.PUBLIC_URL + '#/';
          else setUser(json);
        })
        .catch(console.error);
    }
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <ToolBar>
          <Link
            color="inherit"
            href={`https://discord.com/oauth2/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=bot&permissions=8`}
            className={classes.elements}
          >
            Invite
          </Link>

          {hasToken && (
            <Link color="inherit" href={process.env.PUBLIC_URL + '#/guilds'}>
              Guilds
            </Link>
          )}

          <div className={classes.spacer} />

          {user ? (
            <div>
              <Avatar
                alt={user.username}
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`}
              ></Avatar>
              <Box mr={6} />
            </div>
          ) : null}
          {/* If we have user info, display username, else if have the token but no user info yet, display a skeleton otherwise display login */}
          {user ? (
            <Typography variant="subtitle2">
              <b>{user.username}</b>#{user.discriminator}
            </Typography>
          ) : !user && hasToken ? (
            <Skeleton variant="rect" width={150} height={16} animation="wave" />
          ) : (
            <Link
              color="inherit"
              href={`https://discord.com/api/oauth2/authorize?client_id=${
                process.env.REACT_APP_CLIENT_ID
              }&redirect_uri=${encodeURIComponent(
                process.env.REACT_APP_DISCORD_REDIRECT_URL
              )}&response_type=code&scope=guilds%20identify`}
            >
              Login with Discord
            </Link>
          )}

          {user && (
            <IconButton aria-label="drop down menu" color="inherit" onClick={handleToggle}>
              <KeyboardArrowDownIcon />
            </IconButton>
          )}
          {userDropdown()}
        </ToolBar>
      </AppBar>
    </div>
  );
}
