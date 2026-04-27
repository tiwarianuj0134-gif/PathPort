const path = require('path');
// Load .env from Server/ directory regardless of CWD
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  PORT: process.env.PORT || 5000,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
