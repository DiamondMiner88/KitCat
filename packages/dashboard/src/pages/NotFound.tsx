import React from 'react';
import { useHistory } from 'react-router-dom';

// Material-UI
import { Button } from '@material-ui/core';

// Components
import { NavBar } from '../components';

export default function NotFound(props: any) {
    const history = useHistory();
    return (
        <div>
            <NavBar location={props.location} />
            <div className="container">
                <h1>This page doesn't exist!</h1>
                <Button onClick={() => history.goBack()}>Go Back</Button>
            </div>
        </div>
    );
}
