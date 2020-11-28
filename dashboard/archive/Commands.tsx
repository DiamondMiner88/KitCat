import React from 'react';

// Material-UI
import { makeStyles } from '@material-ui/core/styles';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

// Components
import { NavBar, HomeSidebar, CookieConsent } from '../components';

// Other
import command_data from '../data/commands';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    Accordion: {
        backgroundColor: '#f1f1f1f2',
    },
    code: {
        backgroundColor: '#f2f2f2',
        color: '#e83e8c',
    },
    background: {
        backgroundColor: 'white',
    },
}));

export default function Commands(props: any) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CookieConsent />
            <NavBar location={props.location} />
            <HomeSidebar />
            <div className="container">
                {command_data.categories.map((category) => {
                    return (
                        <div>
                            <h2>{category.display_name}</h2>
                            {category.commands.map((cmdName) => {
                                const cmd = command_data.commands.find((cmd) => cmd.executor === cmdName);
                                if (!cmd) return null;
                                return (
                                    <div>
                                        <Accordion className={classes.Accordion}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`command-content-${cmd.executor}`}
                                                id={`command-header-${cmd.executor}`}
                                            >
                                                <Typography className={classes.heading}>{cmd.displayName}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails className={classes.background}>
                                                <Typography>
                                                    {cmd.description}
                                                    <br />
                                                    <strong>Usage</strong>
                                                    <br />
                                                    <code
                                                        className={classes.code}
                                                    >{`k!${cmd.executor} ${cmd.usage}`}</code>
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
