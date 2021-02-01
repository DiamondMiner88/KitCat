import React from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Link, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@material-ui/core';
import { Storage as StorageIcon, Warning as WarningIcon } from '@material-ui/icons/';

// Other
import Cookies from 'universal-cookie';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: 300,
        flexShrink: 0,
    },
    drawerPaper: {
        width: 300,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    toolbar: theme.mixins.toolbar,
    link: {
        textDecoration: 'none',
    },
}));

export default function Sidebar(props: any) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
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
                                href={process.env.PUBLIC_URL + '#/guilds'}
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
                        <ListItem
                            button
                            key="status"
                            component={Link}
                            href={process.env.PUBLIC_URL + '#/status'}
                            className={classes.link}
                        >
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
