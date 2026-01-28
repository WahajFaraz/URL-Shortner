import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

export const securityMiddleware = [
  helmet(),
  mongoSanitize(),
];

export const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

// CORS configuration: allow your Vercel frontend + local dev
// We include both an ENV-based URL and the concrete deployed frontend URL.
const allowedOrigins = [
  process.env.FRONTEND_URL, // optional, e.g. https://url-shortner-rose-three.vercel.app
  'https://url-shortner-rose-three.vercel.app',
  'http://localhost:5173',
];

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser / same-origin requests
    if (!origin) {
      return callback(null, true);
    }

    const isAllowed = allowedOrigins.filter(Boolean).includes(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
