const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { join } = require('path');
const { readFile } = require('fs/promises');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;
      
      // Handle static files
      if (pathname.startsWith('/_next/static/') || pathname.startsWith('/static/')) {
        const filePath = join(__dirname, '.next', pathname);
        try {
          const data = await readFile(filePath);
          res.setHeader('Content-Type', getContentType(pathname));
          res.end(data);
          return;
        } catch (err) {
          console.error('Error serving static file:', err);
          res.statusCode = 404;
          res.end('Not found');
          return;
        }
      }
      
      // Handle all other requests
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});

function getContentType(path) {
  if (path.endsWith('.js')) return 'application/javascript';
  if (path.endsWith('.css')) return 'text/css';
  if (path.endsWith('.json')) return 'application/json';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  if (path.endsWith('.webp')) return 'image/webp';
  if (path.endsWith('.gif')) return 'image/gif';
  return 'text/html';
}
