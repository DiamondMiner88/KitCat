const fetch = require('node-fetch');

function getAPIURL(params) {
  if (params.env === 'dev') return 'http://24.16.44.237:4001/api/v1.0.0';
  return 'http://24.16.44.237:4000/api/v1.0.0';
}

Parse.Cloud.define('token', async request => {
  let res;
  try {
    res = await fetch(`${getAPIURL(request.params)}/token`, {
      method: 'POST',
      body: request.params
    });
    res = await res.json();
  } catch (error) {
    return {
      message: 'Could not send request to backend. Please try again later'
      // error: error
    };
  }
  return res;
});

// Parse.Cloud.define('save', async (request) => {
//   let res;
//   try {
//     res = await fetch(`${getAPIURL(request.params)}/${request.params.guild}/save`, {
//       method: 'POST',
//       body: request.params
//     });
//   } catch (error) {}
// });

// Parse.Cloud.define('guild', async (request) => {
//   if (!request.params['access-token']) return { message: 'Missing body data.' };

//   if (request.params.guild && request.params.settings) {
//     let res = await fetch(`${getAPIURL(request.params)}/guild/${request.params.guild}/save`, {
//       method: 'GET',
//       headers: {
//         'access-token': request.params['access-token'],
//         settings: request.params.settings
//       }
//     });
//     let resData = await res.json();
//     return resData;
//   } else if (request.params.guild) {
//     let res = await fetch(`${getAPIURL(request.params)}/guild/${request.params.guild}`, {
//       method: 'GET',
//       headers: {
//         'access-token': request.params['access-token']
//       }
//     });
//     let resData = await res.json();
//     return resData;
//   } else {
//     let res = await fetch(`${getAPIURL(request.params)}/guilds`, {
//       method: 'GET',
//       headers: {
//         'access-token': request.params['access-token']
//       }
//     });
//     let resData = await res.json();
//     return resData;
//   }
// });
