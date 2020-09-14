import React from 'react';

import { Navbar } from '../components';
import { CookieConsent } from '../components';

export default function NotFound(props) {
  return (
    <div>
      <CookieConsent />
      <Navbar location={props.history} />
      <div className="container">
        <h2>This page has not been done yet. :/</h2>
      </div>
    </div>
  );
}
