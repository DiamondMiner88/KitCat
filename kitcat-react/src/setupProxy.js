const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // app.use(
  //   '/functions',
  //   createProxyMiddleware({
  //     target: 'https://parseapi.back4app.com',
  //     changeOrigin: true,
  //     headers: {
  //       'X-Parse-Application-Id': process.env.REACT_APP_PARSE_ID,
  //       'X-Parse-Javascript-Key': process.env.REACT_APP_PARSE_JS_KEY
  //     }
  //   })
  // );
};
