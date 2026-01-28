import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import { errorHandler, asyncHandler } from './middleware/errorHandler.js';
import { securityMiddleware, requestLogger, corsOptions } from './middleware/security.js';
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoutes.js';
import redirectRoutes from './routes/redirectRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import * as urlController from './controllers/urlController.js';

dotenv.config();

const app = express();

// Connect to database (safe for serverless: driver manages connections)
connectDB();

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(requestLogger);
app.use(...securityMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/admin', adminRoutes);
app.use('/redirect', redirectRoutes);

// Build a reusable status payload (for / and /api/status)
const buildStatusPayload = () => {
  const dbState = mongoose.connection.readyState;
  const dbStatesMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    success: true,
    message: 'Backend status',
    database: {
      state: dbStatesMap[dbState] || 'unknown',
      readyState: dbState,
    },
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    env: {
      nodeEnv: process.env.NODE_ENV || 'development',
    },
    timestamp: new Date().toISOString(),
  };
};

// Simple HTML/JSON home page for the backend root
app.get('/', (req, res) => {
  const status = buildStatusPayload();

  // If client accepts HTML, show a small HTML status page
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    res.status(200).send(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>URL Shortener Backend Status</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:#050816; color:#f3f4f6; margin:0; padding:24px; display:flex; align-items:center; justify-content:center; min-height:100vh; }
            .card { max-width:720px; width:100%; background:linear-gradient(135deg,#111827,#020617); border-radius:18px; padding:24px 24px 20px; box-shadow:0 20px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(148,163,184,0.15); border:1px solid rgba(55,65,81,0.9); }
            h1 { margin:0 0 6px; font-size:24px; display:flex; align-items:center; gap:8px; }
            h1 span.logo { display:inline-flex; width:26px; height:26px; border-radius:9px; background:radial-gradient(circle at 0 0,#22d3ee,#6366f1); align-items:center; justify-content:center; font-size:16px; font-weight:700; color:#0b1120; box-shadow:0 0 0 1px rgba(15,23,42,0.7); }
            h1 span.sub { font-size:13px; font-weight:500; color:#9ca3af; text-transform:uppercase; letter-spacing:0.16em; }
            p { margin:0 0 8px; color:#9ca3af; font-size:13px; }
            .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:10px; margin-top:14px; }
            .pill { padding:9px 11px; border-radius:10px; background:rgba(15,23,42,0.9); border:1px solid rgba(55,65,81,0.9); font-size:12px; display:flex; flex-direction:column; gap:2px; }
            .label { text-transform:uppercase; letter-spacing:0.14em; font-size:10px; color:#6b7280; }
            .value { font-weight:600; color:#e5e7eb; word-break:break-word; }
            .value.ok { color:#4ade80; }
            .value.bad { color:#f97373; }
            code { font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size:11px; }
            .footer { margin-top:16px; display:flex; justify-content:space-between; align-items:center; gap:10px; font-size:11px; color:#6b7280; }
            .footer a { color:#a5b4fc; text-decoration:none; }
            .footer a:hover { text-decoration:underline; }
            @media (max-width:640px) {
              body { padding:18px; }
              .card { padding:18px 16px 14px; }
              h1 { font-size:21px; }
            }
          </style>
        </head>
        <body>
          <main class="card">
            <h1>
              <span class="logo">U</span>
              URL Shortener
              <span class="sub">Backend</span>
            </h1>
            <p>Backend is running. Use this as a quick health dashboard for your Vercel deployment.</p>

            <section class="grid">
              <div class="pill">
                <span class="label">Database</span>
                <span class="value ${status.database.state === 'connected' ? 'ok' : 'bad'}">${status.database.state}</span>
                <span class="label">Ready State</span>
                <span class="value"><code>${status.database.readyState}</code></span>
              </div>
              <div class="pill">
                <span class="label">Uptime (s)</span>
                <span class="value"><code>${status.uptime.toFixed(1)}</code></span>
                <span class="label">Memory (MB)</span>
                <span class="value">
                  <code>
                    RSS: ${(status.memoryUsage.rss / 1024 / 1024).toFixed(1)} •
                    Heap Used: ${(status.memoryUsage.heapUsed / 1024 / 1024).toFixed(1)}
                  </code>
                </span>
              </div>
              <div class="pill">
                <span class="label">Environment</span>
                <span class="value"><code>${status.env.nodeEnv}</code></span>
                <span class="label">Timestamp</span>
                <span class="value"><code>${status.timestamp}</code></span>
              </div>
            </section>

            <div class="footer">
              <span>JSON status also available at <code>/api/status</code> and <code>/api/health</code></span>
              <span>Short URLs: <code>/{'{shortCode}'}</code></span>
            </div>
          </main>
        </body>
      </html>
    `);
  } else {
    // Fallback to JSON for programmatic clients
    res.status(200).json(status);
  }
});

// API health & status (for monitoring/homepage info)
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.get('/api/status', (req, res) => {
  const status = buildStatusPayload();
  res.status(200).json(status);
});

// Simple inline SVG favicon for backend domain
const faviconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#22d3ee"/>
        <stop offset="1" stop-color="#6366f1"/>
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="52" height="52" rx="16" fill="#020617"/>
    <rect x="10" y="10" width="44" height="44" rx="14" fill="url(#g)"/>
    <path d="M22 34a7 7 0 0 1 0-10l6-6a7 7 0 0 1 9.9 9.9l-1.9 1.9" fill="none" stroke="#0b1120" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M42 30a7 7 0 0 1 0 10l-6 6a7 7 0 0 1-9.9-9.9l2-2" fill="none" stroke="#0b1120" stroke-width="3.4" stroke-linecap="round"/>
  </svg>
`;

app.get(['/favicon.ico', '/favicon.png'], (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.status(200).send(faviconSvg);
});

// Handle short URL redirects directly (supports generated codes + custom aliases)
// Allowed chars align with the ShortUrl model: /^[a-zA-Z0-9-_]{1,30}$/
app.get('/:shortCode([a-zA-Z0-9-_]{1,30})', asyncHandler(urlController.getShortUrl));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorHandler);

export default app;


