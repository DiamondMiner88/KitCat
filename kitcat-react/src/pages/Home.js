import React from 'react';

// Material-UI
import { Link } from '@material-ui/core';

// Components
import { HomeSidebar, Navbar } from '../components';
import { CookieConsent } from '../functions';

// Other
import Cookies from 'universal-cookie';
import { ReactIsInDevelomentMode } from '../functions';
import fetch from 'node-fetch';

export default function Home(props) {
  React.useEffect(() => {
    const cookies = new Cookies();

    const code = /\?code=(.{30})/.exec(window.location.href);

    if (window.location.href.includes('?error=')) window.location = process.env.PUBLIC_URL + '#/';
    else if (window.location.href.includes('?code=')) {
      fetch(`https://parseapi.back4app.com/functions/getAccessToken`, {
        method: 'POST',
        headers: {
          'X-Parse-Application-Id': process.env.REACT_APP_PARSE_ID,
          'X-Parse-Javascript-Key': process.env.REACT_APP_PARSE_JS_KEY
        },
        body: JSON.stringify({
          env: ReactIsInDevelomentMode() ? 'development' : 'production',
          code: code[1],
          'url-redirect': process.env.REACT_APP_DISCORD_REDIRECT_URL
        })
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          if (json.result.access_token)
            cookies.set('access-token', json.result.access_token, {
              path: '/',
              maxAge: 604000,
              sameSite: 'strict',
              overwrite: true,
              secure: true
            });
          window.location = process.env.PUBLIC_URL + '#/';
        })
        .catch((error) => console.error(error));
    }
  }, [props.location]);

  return (
    <div>
      <Navbar location={props.location} />
      <HomeSidebar />
      <CookieConsent />
      <div className="container">
        <h1>KitCat</h1>
        <h2>What is this bot?</h2>
        <p>
          KitCat is a bot that can help you manage your server with a ton of commands, along with a
          server editor that you can use to change server settings to what you think fits.
        </p>
        <h2>What can I do?</h2>
        <p>
          There are many things you can do with the bot. Check out the{' '}
          <Link href={process.env.PUBLIC_URL + '#/commands'}>commands</Link> page for more
          information.
        </p>
      </div>
    </div>
  );
}
