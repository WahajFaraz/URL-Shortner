import app from '../src/app.js';

// Single entrypoint for all /api/* routes on Vercel
export default function handler(req, res) {
  return app(req, res);
}


