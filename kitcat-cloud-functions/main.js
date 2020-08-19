const FormData = require('form-data');
const fetch = require('node-fetch');
const config = {
  client_id: '744613719501176893',
  client_secret: 'MOqqQHwRhD7MwLrodpy_Y_-RB_RES2Ed',
  botapi_url: 'http://24.16.44.237:4000'
};

Parse.Cloud.define('token', async (request) => {
  if (request.headers.code && request.headers['url-redirect']) {
    const code = request.headers.code;
    const data = new FormData();

    data.append('client_id', config.client_id);
    data.append('client_secret', config.client_secret);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', request.headers['url-redirect']);
    data.append('scope', 'identify');
    data.append('code', code);

    let res = await fetch('https://discordapp.com/api/oauth2/token', {
      method: 'POST',
      body: data
    });

    let resdata = await res.json();
    return resdata;
  } else return { message: 'Missing headers' };
});

Parse.Cloud.define('guild', async (request) => {
  if (!request.headers['access-token']) {
    return { message: 'Missing headers.' };
  }

  if (request.headers.guild && request.headers.data) {
    let res = await fetch(`${config.botapi_url}/guild/${request.headers.guild}/save`, {
      method: 'GET',
      headers: {
        'access-token': request.headers['access-token'],
        data: request.headers.data
      }
    });
    let resData = await res.json();
    return resData;
  } else if (request.headers.guild) {
    let res = await fetch(`${config.botapi_url}/guild/${request.headers.guild}`, {
      method: 'GET',
      headers: {
        'access-token': request.headers['access-token']
      }
    });
    let resData = await res.json();
    return resData;
  } else {
    let res = await fetch(`${config.botapi_url}/guilds`, {
      method: 'GET',
      headers: {
        'access-token': request.headers['access-token']
      }
    });
    let resData = await res.json();
    return resData;
  }
});
