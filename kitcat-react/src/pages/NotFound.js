import React from 'react';
import { useHistory } from 'react-router-dom';

// Material-UI
import { Button } from '@material-ui/core';

// Components
import { CookieConsent } from '../functions';

export default function NotFound(props) {
  const history = useHistory();
  return (
    <div>
      <CookieConsent />
      <div className="container">
        <h1>404 - Not Found</h1>
        <Button onClick={() => history.goBack()}>Go Back</Button>
      </div>
    </div>
  );
}
