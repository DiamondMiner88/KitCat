import React from 'react';
import MUICookieConsent from 'material-ui-cookie-consent';

export function ReactIsInDevelomentMode() {
  return false;
  // return '_self' in React.createElement('div');
}

export function CookieConsent() {
  return (
    <MUICookieConsent
      cookieName="cookie-consent"
      componentType="Snackbar"
      message="We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies. More info can be found at /cookies"
    />
  );
}
