import React, { useState } from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    Link,
    Toolbar,
    Typography,
    ClickAwayListener,
    Grow,
    Paper,
    Popper,
    MenuItem,
    MenuList,
} from '@material-ui/core';

// Other
import Cookies from 'universal-cookie';
import fetch from 'node-fetch';
import { getUser, REDIRECT_URL } from '../data/api';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    spacer: {
        flex: '1 1 auto',
    },
    elements: {
        paddingRight: theme.spacing(3),
    },
}));

export default function Navbar(props: any) {
    const classes = useStyles();
    const [user, setUser] = useState(null);
    getUser();

    //User drop down
    const [userDropdownRef, setUserDropdownRef] = React.useState(null);
    const userDropdown = () => {
        return (
            <div className={classes.root}>
                <Popper
                    open={Boolean(userDropdownRef)}
                    anchorEl={userDropdownRef}
                    role={undefined}
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={() => setUserDropdownRef(null)}>
                                    <MenuList
                                        autoFocusItem={Boolean(userDropdownRef)}
                                        id="menu-list-grow"
                                        onKeyDown={(event) => {
                                            if (event.key === 'Tab') {
                                                event.preventDefault();
                                                setUserDropdownRef(null);
                                            }
                                        }}
                                    >
                                        <MenuItem
                                            onClick={(event) => {
                                                setUserDropdownRef(null);
                                                // Remove all cookies
                                                const exp = new Date().toUTCString();
                                                document.cookie.split(';').forEach((c) => {
                                                    document.cookie = c
                                                        .replace(/^ +/, '')
                                                        .replace(/=.*/, '=;expires=' + exp + ';path=/');
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

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
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
                    {user ? (
                        <Typography variant="subtitle2">
                            <b>{user.username}</b>#{user.discriminator}
                        </Typography>
                    ) : !user && hasToken ? (
                        <Skeleton variant="rect" width={150} height={16} animation="wave" />
                    ) : (
                        <Link color="inherit" href={REDIRECT_URL}>
                            Login with Discord
                        </Link>
                    )}

                    {user && (
                        <IconButton
                            aria-label="drop down menu"
                            color="inherit"
                            // onClick={(event) => setUserDropdownRef(event.currentTarget)}
                        >
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    )}
                    {/* {userDropdown()} */}
                </Toolbar>
            </AppBar>
        </div>
    );
}
