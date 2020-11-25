import React from "react";

// Material-UI
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
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
    MenuList
} from "@material-ui/core";

// Other
import Cookies from "universal-cookie";
import fetch from "node-fetch";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    spacer: {
        flex: "1 1 auto"
    },
    elements: {
        paddingRight: theme.spacing(3)
    }
}));

export default function Navbar(props) {
    const classes = useStyles();
    const [hasToken, setHasToken] = React.useState(false);
    const [user, setUser] = React.useState();

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
                                transformOrigin:
                                    placement === "bottom"
                                        ? "center top"
                                        : "center bottom"
                            }}
                        >
                            <Paper>
                                <ClickAwayListener
                                    onClickAway={() => setUserDropdownRef(null)}
                                >
                                    <MenuList
                                        autoFocusItem={Boolean(userDropdownRef)}
                                        id="menu-list-grow"
                                        onKeyDown={event => {
                                            if (event.key === "Tab") {
                                                event.preventDefault();
                                                setUserDropdownRef(null);
                                            }
                                        }}
                                    >
                                        <MenuItem
                                            onClick={event => {
                                                setUserDropdownRef(null);
                                                // Remove all cookies
                                                const exp = new Date().toUTCString();
                                                document.cookie
                                                    .split(";")
                                                    .forEach(c => {
                                                        document.cookie = c
                                                            .replace(/^ +/, "")
                                                            .replace(
                                                                /=.*/,
                                                                "=;expires=" +
                                                                    exp +
                                                                    ";path=/"
                                                            );
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

    React.useEffect(() => {
        const cookies = new Cookies();
        if (cookies.get("access-token") !== undefined) {
            setHasToken(true);
            fetch("https://discord.com/api/users/@me", {
                headers: {
                    authorization: `Bearer ${cookies.get("access-token")}`
                }
            })
                .then(res => res.json())
                .then(json => {
                    if (json.message)
                        window.location = process.env.PUBLIC_URL + "#/";
                    else setUser(json);
                })
                .catch(console.error);
        }
    }, []);

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
                        <Link
                            color="inherit"
                            href={process.env.PUBLIC_URL + "#/guilds"}
                        >
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
                        <Skeleton
                            variant="rect"
                            width={150}
                            height={16}
                            animation="wave"
                        />
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
                        <IconButton
                            aria-label="drop down menu"
                            color="inherit"
                            onClick={event =>
                                setUserDropdownRef(event.currentTarget)
                            }
                        >
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    )}
                    {userDropdown()}
                </Toolbar>
            </AppBar>
        </div>
    );
}
