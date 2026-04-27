/** Global error handling middleware */
const errorHandler = (err, req, res, next) => {
  // MongoDB connection errors — give a clear message
  if (
    err.name === 'MongoNetworkError' ||
    err.name === 'MongoServerSelectionError' ||
    err.message?.includes('ECONNREFUSED') ||
    err.message?.includes('buffering timed out') ||
    err.message?.includes('Could not connect')
  ) {
    return res.status(503).json({
      message: 'Database unavailable. Please check MongoDB Atlas IP whitelist settings.',
      fix: 'Go to MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
