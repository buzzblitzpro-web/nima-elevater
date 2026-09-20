const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.pdf': 'application/pdf'
};

// Aliases for user-friendly clean URLs
const ROUTE_ALIASES = {
  '/': '/index.html',
  '/home': '/index.html',
  '/index': '/index.html',
  '/about': '/about.html',
  '/about-us': '/about.html',
  '/products': '/products.html',
  '/services': '/products.html',
  '/catalog': '/products.html',
  '/maintenance': '/maintenance.html',
  '/service': '/maintenance.html',
  '/amc': '/maintenance.html',
  '/contact': '/contact.html',
  '/contact-us': '/contact.html',
  '/quote': '/contact.html'
};

function serveFile(res, filePath, statusCode = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (statusCode !== 404) {
        serve404(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 - Floor Not Found');
      }
      return;
    }
    res.writeHead(statusCode, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });
    res.end(data);
  });
}

function serve404(res) {
  const custom404Path = path.join(PUBLIC_DIR, '404.html');
  if (fs.existsSync(custom404Path)) {
    serveFile(res, custom404Path, 404);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 - Not Found');
  }
}

function resolveFilePath(reqUrl) {
  // Strip query string and hash
  let cleanUrl = reqUrl.split('?')[0].split('#')[0];

  // Decode URI components
  try {
    cleanUrl = decodeURIComponent(cleanUrl);
  } catch (e) {
    return null;
  }

  // Check route aliases first (case insensitive)
  const lowerUrl = cleanUrl.toLowerCase().replace(/\/+$/, '') || '/';
  if (ROUTE_ALIASES[lowerUrl]) {
    cleanUrl = ROUTE_ALIASES[lowerUrl];
  }

  // Prevent path traversal
  const safePath = path.normalize(cleanUrl).replace(/^(\.\.[\/\\])+/, '');
  let fullPath = path.join(PUBLIC_DIR, safePath);

  // Security check: ensure target stays within PUBLIC_DIR
  if (!fullPath.startsWith(PUBLIC_DIR)) {
    return null;
  }

  // 1. Direct file check
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    return fullPath;
  }

  // 2. Check with .html extension (Clean URLs: /about -> /about.html)
  const htmlPath = fullPath + '.html';
  if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
    return htmlPath;
  }

  // 3. Check directory index.html (/subdir/ -> /subdir/index.html)
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    const dirIndexPath = path.join(fullPath, 'index.html');
    if (fs.existsSync(dirIndexPath) && fs.statSync(dirIndexPath).isFile()) {
      return dirIndexPath;
    }
  }

  // 4. Case-insensitive filesystem fallback
  const baseName = path.basename(cleanUrl).toLowerCase();
  const dirName = path.dirname(fullPath);
  if (fs.existsSync(dirName)) {
    const files = fs.readdirSync(dirName);
    for (const file of files) {
      if (file.toLowerCase() === baseName || file.toLowerCase() === baseName + '.html') {
        const matched = path.join(dirName, file);
        if (fs.statSync(matched).isFile()) {
          return matched;
        }
      }
    }
  }

  return null;
}

const server = http.createServer((req, res) => {
  // Handle HTTP methods
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('405 Method Not Allowed');
    return;
  }

  const resolved = resolveFilePath(req.url);

  if (resolved) {
    serveFile(res, resolved);
  } else {
    serve404(res);
  }
});

server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Nimma Elevator Server running at:`);
  console.log(` > http://localhost:${PORT}/`);
  console.log(` Routes supported:`);
  console.log(`  - / (Home)`);
  console.log(`  - /products or /products.html`);
  console.log(`  - /about or /about.html`);
  console.log(`  - /maintenance or /maintenance.html`);
  console.log(`  - /contact or /contact.html`);
  console.log(`=========================================`);
});
