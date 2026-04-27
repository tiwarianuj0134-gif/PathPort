const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const { PORT, CLIENT_ORIGIN } = require('./src/config/env');
const allRoutes = require('./src/routes/allRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const { generalLimiter } = require('./src/middlewares/rateLimiter');
const { healthCheck } = require('./src/controllers/mainControllers');

const app = express();

// Trust proxy (needed on Render/Heroku for secure cookies)
app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Build allowed origins list from env
const allowedOrigins = [
  ...CLIENT_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean),
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`CORS blocked: ${origin}`);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Handle preflight for all routes
app.options('*', cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(generalLimiter);

app.get('/api/health', healthCheck);
app.use('/api', allRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

app.use(errorHandler);

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`\n? PathPort backend running on port ${PORT}`);
    console.log(`   Allowed origins: ${allowedOrigins.join(', ')}`);
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}\n`);
  });
};

connectDB()
  .then(startServer)
  .catch((err) => {
    console.error('\n? MongoDB connection failed:', err.message);
    startServer();
  });
