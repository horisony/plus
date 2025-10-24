const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const target = 'http://localhost:8080';
  const proxyPaths = ['/api', '/auth', '/me'];

  proxyPaths.forEach((pathPrefix) => {
    console.log(`PROXY SETUP: ${pathPrefix} -> ${target}`);
    const normalizedPrefix = pathPrefix.endsWith('/') ? pathPrefix.slice(0, -1) : pathPrefix;
    app.use(
      pathPrefix,
      createProxyMiddleware({
        target,
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        pathRewrite: (path) => {
          if (path === '/' || path === '') {
            return normalizedPrefix;
          }
          return `${normalizedPrefix}${path}`;
        },
        onProxyReq: (proxyReq, req) => {
          console.log(`PROXY REQUEST: ${req.method} ${req.url} -> ${target}${req.originalUrl || req.url}`);
          proxyReq.setHeader('X-Real-IP', req.ip);
          proxyReq.setHeader('X-Forwarded-For', req.ip);
        },
        onProxyRes: (proxyRes, req) => {
          console.log(`PROXY RESPONSE: ${proxyRes.statusCode} for ${req.url}`);
        },
        onError: (err, req) => {
          console.log(`PROXY ERROR: ${err.message} for ${req.url}`);
        },
      }),
    );
  });
};