import app from '../src/app.js';

// Catch-all API route so /api/* is handled by the Express app
export default function handler(req, res) {
  return app(req, res);
}


