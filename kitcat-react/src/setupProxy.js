const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://discord.com',
      changeOrigin: true
    })
  );
  app.use(
    '/bot/token',
    createProxyMiddleware({
      target: 'http://762c04225862.ngrok.io',
      changeOrigin: true
    })
  );
  app.use(
    '/bot/guild',
    createProxyMiddleware({
      target: 'http://762c04225862.ngrok.io',
      changeOrigin: true
    })
  );
  app.use(
    '/bot/guilds',
    createProxyMiddleware({
      target: 'http://762c04225862.ngrok.io',
      changeOrigin: true
    })
  );
};
