const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('PROXY SETUP: Setting up proxy for /api/');
  
  // 参考nginx配置: location /api/ { proxy_pass http://backend; }
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log(`PROXY REQUEST: ${req.method} ${req.url} -> http://localhost:8080${req.url}`);
        // 确保请求头正确传递
        proxyReq.setHeader('X-Real-IP', req.ip);
        proxyReq.setHeader('X-Forwarded-For', req.ip);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`PROXY RESPONSE: ${proxyRes.statusCode} for ${req.url}`);
      },
      onError: (err, req, res) => {
        console.log(`PROXY ERROR: ${err.message} for ${req.url}`);
      }
    })
  );
};