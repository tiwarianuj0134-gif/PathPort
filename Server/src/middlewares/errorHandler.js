/** Global error handling middleware */
const errorHandler = (err, req, res, next) => {
  // Always log errors (needed for Render debugging)
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);
  if (err.stack) console.error(err.stack.split('\n').slice(0, 4).join('\n'));

  // MongoDB connection errors
  if (
    err.name === 'MongoNetworkError' ||
    err.name === 'MongoServerSelectionError' ||
    err.message?.includes('ECONNREFUSED') ||
    err.message?.includes('buffering timed out') ||
    err.message?.includes('Could not connect')
  ) {
    return res.status(503).json({
      message: 'Database unavailable. Please check MongoDB Atlas IP whitelist settings.',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
