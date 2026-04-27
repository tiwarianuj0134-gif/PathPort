// Health check controller
const healthCheck = (req, res) => {
  res.json({ status: 'ok', message: 'PathPort API is running.', timestamp: new Date().toISOString() });
};

module.exports = { healthCheck };
