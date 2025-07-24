import { createServer } from 'http';
import { parse } from 'url';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter, createContext } from '../lib/trpc/server';

const server = createServer(async (req, res) => {
  const url = parse(req.url!, true);
  
  if (url.pathname?.startsWith('/api/trpc')) {
    const response = await fetchRequestHandler({
      endpoint: '/api/trpc',
      req: req as any,
      router: appRouter,
      createContext,
      onError:
        process.env.NODE_ENV === 'development'
          ? ({ path, error }) => {
              console.error(
                `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
              );
            }
          : undefined,
    });

    // Copy response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    res.writeHead(response.status, response.statusText);
    res.end(await response.text());
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

export { server }; 