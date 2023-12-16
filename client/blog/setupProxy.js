const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'three35finalclient.onrender.com',
      changeOrigin: true,
    })
  );
};