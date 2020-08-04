const functions = require('firebase-functions');
const FormData = require('form-data');
const url = require('url');
const config = require('./config.json');
const fetch = require('node-fetch');

exports.token = functions.https.onRequest((request, response) => {
  const urlObj = url.parse(request.url, true);
  if (urlObj.query.code) {
    const code = urlObj.query.code;
    const data = new FormData();

    data.append('client_id', config.client_id);
    data.append('client_secret', config.client_secret);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', config.redirect_uri);
    data.append('scope', 'identify');
    data.append('code', code);

    fetch('https://discordapp.com/api/oauth2/token', {
      method: 'POST',
      body: data
    })
      .then((res) => res.json())
      .then((json) => response.json(json));
  }
});

exports.guild = functions.https.onRequest((request, response) => {
  const params = request.path.substring(1).split(/\/|$/);
  if (!request.headers['token-type'] && !request.headers['access-token']) {
    response.status(400).json({
      message: 'Missing authentication.'
    });
    return;
  }

  if (params[1] === 'save') {
    fetch(`${config.botapi_url}/guild/${params[0]}/save`, {
      method: 'GET',
      headers: {
        'token-type': request.headers['token-type'],
        'access-token': request.headers['access-token'],
        data: request.headers['data']
      }
    })
      .then((res) => res.json())
      .then((json) => {
        response.status(200).json(json);
      });
  } else {
    fetch(`${config.botapi_url}/guild/${params[0]}`, {
      method: 'GET',
      headers: {
        'token-type': request.headers['token-type'],
        'access-token': request.headers['access-token']
      }
    })
      .then((res) => res.json())
      .then((json) => {
        response.status(200).json(json);
      });
  }
});
