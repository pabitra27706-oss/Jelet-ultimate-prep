import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

export const base = '/Jelet-ultimate-prep/';
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8',
};

// Local static artifact preview only. Never expose the checkout or serve an index of files.
export async function staticServer({ redirectRoot = false } = {}) {
  const root = await realpath('dist');
  return createServer(async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    try {
      const url = new URL(req.url, 'http://localhost');
      if (redirectRoot && url.pathname === '/') {
        res.writeHead(302, { Location: base + url.search }).end();
        return;
      }
      if (!url.pathname.startsWith(base)) throw new Error('outside project base');
      const relative = url.pathname.slice(base.length) + (url.pathname.endsWith('/') ? 'index.html' : '');
      const file = await realpath(resolve(root, decodeURIComponent(relative)));
      const contentType = types[extname(file)];
      if (!file.startsWith(root + sep) || !contentType) throw new Error('unexpected artifact');
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': contentType, 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    }
  });
}
