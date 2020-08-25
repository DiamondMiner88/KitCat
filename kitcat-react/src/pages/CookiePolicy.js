import React from 'react';

import { Navbar } from '../components';
import { CookieConsent } from '../functions';

export default function NotFound(props) {
  return (
    <div>
      <Navbar location={props.history} />
      <CookieConsent />
      <div className="container">
        <h2>This page has not been done yet. :/</h2>
      </div>
    </div>
  );
}
