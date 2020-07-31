import React, { Component } from 'react';

const fetch = require('node-fetch');
class _Login extends Component {
  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    if (query.has('code')) {
      fetch(`/despacito-spider-626fa/us-central1/token?code=${query.get('code')}`, {
        method: 'POST'
      })
        .then((res) => res.json())
        .then((json) => {
          console.log('returning');
          if (json.access_token)
            this.props.history.push(
              `/?token_type=${json.token_type}&access_token=${json.access_token}`
            );
          else this.props.history.push(`/`);
        })
        .catch((error) => console.log(error));
    }
  }

  render() {
    return <h1>Getting token from Discord, Please wait...</h1>;
  }
}

export default _Login;
