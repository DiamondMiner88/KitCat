import React from 'react';

// Material-UI
import Button from '@material-ui/core/Button';

function NotFound(props) {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <Button
        onClick={() => {
          props.history.push('/');
        }}
      >
        Go Home
      </Button>
    </div>
  );
}

export default NotFound;
