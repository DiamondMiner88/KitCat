import React, { useEffect } from 'react';

// Material-UI
import Link from '@material-ui/core/Link';

// Components
import HomeSidebar from '../components/HomeSidebar';
import NavBar from '../components/Navbar';

// Other
import Cookies from 'universal-cookie';
const fetch = require('node-fetch');

export default function Home(props) {
  useEffect(() => {
    const cookies = new Cookies();

    const code = /\?code=(.{30})/.exec(window.location.href);

    if (window.location.href.includes('?error=')) window.location = process.env.PUBLIC_URL + '#/';
    else if (window.location.href.includes('?code=')) {
      fetch(`/functions/token`, {
        method: 'POST',
        headers: {
          code: code[1],
          'url-redirect': 'https://kitcat-bot.github.io/KitCat'
        }
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.result.access_token)
            cookies.set('access-token', json.result.access_token, {
              path: '/',
              maxAge: 604000,
              sameSite: 'strict',
              overwrite: true
            });
          window.location = process.env.PUBLIC_URL + '#/';
        })
        .catch((error) => console.log(error));
    }
  }, [props.location]);

  return (
    <div>
      <NavBar location={props.location} />
      <HomeSidebar />
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
