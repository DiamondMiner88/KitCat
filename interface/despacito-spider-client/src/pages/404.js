import React, { Component } from 'react';
import Link from 'react-router-dom/Link';

export default class home extends Component {
  render() {
    return (
      <div>
        <h1>404 - Not Found</h1>
        <Link to="/">Go back home</Link>
      </div>
    );
  }
}
