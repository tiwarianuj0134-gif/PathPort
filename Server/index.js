// Load .env from Server/ directory regardless of where this file is run from
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

app.use(helmet());

app.use(
  cors({
    origin: [
      CLIENT_ORIGIN,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
    ],
    credentials: true,
  })
);

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
    console.log(`\n✅ PathPort backend running on http://localhost:${PORT}`);
    console.log(`   MongoDB: connected`);
    console.log(`   Frontend proxy: http://localhost:5173 → http://localhost:${PORT}\n`);
  });
};

connectDB()
  .then(startServer)
  .catch((err) => {
    console.error('\n❌ MongoDB connection failed:', err.message);
    console.error('\n⚠️  FIX: Go to MongoDB Atlas → Network Access → Add 0.0.0.0/0\n');
    startServer(); // start anyway so frontend shows proper error
  });
