import React from 'react';

// Components
import NavBar from '../components/Navbar';

function Commands(props) {
  return (
    <div>
      <NavBar location={props.location} history={props.history} />
      <div className="container">
        <h2>Replace this</h2>
      </div>
    </div>
  );
}

export default Commands;
