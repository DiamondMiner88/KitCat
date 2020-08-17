import { useEffect } from 'react';

// Other
import Cookies from 'universal-cookie';
const fetch = require('node-fetch');

function Login(props) {
  useEffect(() => {
    const cookies = new Cookies();
    const query = new URLSearchParams(props.location.search);

    if (query.has('error')) props.history.push(`/`);
    else if (query.has('code')) {
      fetch(`/functions/token`, {
        method: 'POST',
        headers: {
          code: query.get('code')
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
          props.history.push(`/`);
        })
        .catch((error) => console.log(error));
    }
  }, [props.history, props.location.search]);

  return null;
}

export default Login;
