import { useEffect } from 'react';
import Cookies from 'universal-cookie';

const fetch = require('node-fetch');

function Login(props) {
  useEffect(() => {
    const cookies = new Cookies();
    const query = new URLSearchParams(props.location.search);
    
    if (query.has('error')) props.history.push(`/`);
    else if (query.has('code')) {
      fetch(`/despacito-spider-626fa/us-central1/token?code=${query.get('code')}`, {
        method: 'POST'
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json)
          if (json.access_token)
            cookies.set('access-token', json.access_token, { path: '/', maxAge: 604000, sameSite: 'strict' });
          props.history.push(`/`);
        })
        .catch((error) => console.log(error));
    }
  }, []);

  return null;
}

export default Login;
