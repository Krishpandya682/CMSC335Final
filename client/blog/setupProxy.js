const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'three35finalapi.onrender.com',
      changeOrigin: true,
    })
  );
};