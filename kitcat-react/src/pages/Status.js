import React from 'react';
import { useHistory } from 'react-router-dom';

// Material-UI
import { Button } from '@material-ui/core';

// Components
import { CookieConsent } from '../functions';

export default function Status(prop) {
  const history = useHistory();
  return (
    <div>
      <CookieConsent />
      <div className="container">
        <h2>This page is coming in the future</h2>
        <Button onClick={() => history.goBack()}>Go Back</Button>
      </div>
    </div>
  );
}
