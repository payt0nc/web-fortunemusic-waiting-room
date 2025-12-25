import express from 'express';
import compression from 'compression';
import path from 'path';
import { render } from './src/entry.server';
import pino from 'pino';

const app = express();
const PORT = process.env.PORT || 3000;
const logger = pino({ 
    level: 'info', 
    timestamp: pino.stdTimeFunctions.isoTime 
});

app.use(compression());
// Parse JSON bodies for API proxying
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: Date.now() - start
    }, "Request handled");
  });
  next();
});

// Serve static assets from dist/assets
// In production, these might be served by Nginx/CloudFront, but good fallback
app.use('/assets', express.static(path.join(process.cwd(), 'dist/assets')));

// Serve root level static files
app.use('/favicon.ico', express.static(path.join(process.cwd(), 'dist/favicon.ico')));
app.use('/robots.txt', express.static(path.join(process.cwd(), 'src/assets/robots.txt'))); // fallback if copied

// API Proxy Routes
app.get('/api/events', async (req, res) => {
    try {
        const response = await fetch("https://api.fortunemusic.app/v1/appGetEventData/");
        if (!response.ok) {
            return res.status(response.status).json({ error: `API ${response.status}` });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        logger.error({ err: error }, "Proxy error /api/events");
        res.status(500).json({ error: "Failed to fetch from FortuneMusic API" });
    }
});

app.post('/api/waitingrooms', async (req, res) => {
    try {
        const response = await fetch("https://meets.fortunemusic.app/lapi/v5/app/dateTimezoneMessages", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Host": "meets.fortunemusic.app"
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: `API ${response.status}` });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        logger.error({ err: error }, "Proxy error /api/waitingrooms");
        res.status(500).json({ error: "Failed to fetch waiting rooms" });
    }
});

// SSR Handler for all other routes
app.all('*', async (req, res) => {
    try {
        // Convert Express request to Web Standard Request
        const protocol = req.protocol;
        const host = req.get('host');
        const url = `${protocol}://${host}${req.originalUrl}`;
        
        const controller = new AbortController();
        res.on('close', () => controller.abort());

        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
            if (Array.isArray(value)) {
                value.forEach(v => headers.append(key, v));
            } else if (typeof value === 'string') {
                headers.set(key, value);
            }
        }

        const init: RequestInit = {
            method: req.method,
            headers: headers,
            signal: controller.signal,
        };

        if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
            init.body = JSON.stringify(req.body);
        }

        const webReq = new Request(url, init);
        
        // Render using the SSR entry point
        const webRes = await render(webReq);

        // Convert Web Response to Express response
        res.status(webRes.status);
        webRes.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        if (webRes.body) {
            const reader = webRes.body.getReader();
            const stream = new ReadableStream({
                start(controller) {
                    return pump();
                    function pump(): Promise<void> {
                        return reader.read().then(({ done, value }) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            controller.enqueue(value);
                            res.write(value);
                            return pump();
                        });
                    }
                }
            });
            // We can just await the stream completion or simpler: use text() if not streaming
            // Since our render() currently returns full HTML string wrapped in Response, text() is safe.
            // But if we move to streaming SSR later, the above pattern is better.
            // For now, let's stick to text() for simplicity and reliability with the current entry.server.tsx
            
            // Wait, entry.server.tsx returns `new Response(fullHtml, ...)`
            // So it's not a stream.
            const html = await webRes.text();
            res.send(html);
        } else {
            res.end();
        }

    } catch (error) {
        logger.error({ err: error }, "SSR Error");
        res.status(500).send(`
            <html>
                <head><title>Server Error</title></head>
                <body>
                    <h1>500 Server Error</h1>
                    <p>An internal error occurred.</p>
                </body>
            </html>
        `);
    }
});

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
