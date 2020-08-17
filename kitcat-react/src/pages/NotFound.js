import React from 'react';

// Material-UI
import Button from '@material-ui/core/Button';

export default function NotFound(props) {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <Button href='/'>
        Go Home
      </Button>
    </div>
  );
}
