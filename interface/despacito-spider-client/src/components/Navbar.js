import React, { useState, useEffect } from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Skeleton from '@material-ui/lab/Skeleton';
import ToolBar from '@material-ui/core/ToolBar';
import Typography from '@material-ui/core/Typography';

// Other
import Cookies from 'universal-cookie';
const fetch = require('node-fetch');

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  spacer: {
    flex: '1 1 auto'
  },
  username: {
    paddingRight: '10px'
  }
}));

function NavBar(props) {
  const classes = useStyles();
  const [hasToken, setHasToken] = useState(false);
  const [user, setUser] = useState();
  const [userDropdownOpened, setUserDropdownOpened] = useState(false);

  useEffect(() => {
    console.log('effect');
    const cookies = new Cookies();
    if (cookies.get('access-token') !== undefined) {
      setHasToken(true);
      fetch('/api/users/@me', {
        headers: {
          authorization: `Bearer ${cookies.get('access-token')}`
        }
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.message) props.history.push(`/`);
          else setUser(json);
        })
        .catch(console.error);
    }
  }, [props.history]);

  return (
    <div className={classes.root}>
      <AppBar>
        <ToolBar>
          {!hasToken && !user && (
            <Button
              color="inherit"
              href="https://discord.com/api/oauth2/authorize?client_id=713778178967076945&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ftoken&response_type=code&scope=identify"
            >
              Login
            </Button>
          )}

          <div className={classes.spacer} />

          {user ? (
            <Typography variant="subtitle2" className={classes.username}>
              <b>{user.username}</b>#{user.discriminator}
            </Typography>
          ) : (
            <Skeleton variant="rect" width={150} height={16} animation="wave" />
          )}

          {user && (
            <IconButton
              aria-label="drop down menu"
              color="inherit"
              onClick={() => {
                setUserDropdownOpened(!userDropdownOpened);
              }}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
          )}
        </ToolBar>
      </AppBar>
    </div>
  );
}

export default NavBar;
