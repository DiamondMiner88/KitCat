import React from 'react';
import ReactCookieConsent from 'react-cookie-consent';

import { makeStyles } from '@material-ui/core/styles';

//TODO: work on this

const useStyles = makeStyles((theme) => ({
  container: {
    zIndex: 9999
  }
}));

export function CookieConsent() {
  const classes = useStyles();
  return (
    <ReactCookieConsent containerClasses={classes.container}>
      This website uses cookies to enhance the user experience. By continuing to visit this site you
      agree to our use of cookies.
    </ReactCookieConsent>
  );
}
