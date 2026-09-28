/**
 * Global Express error handler.
 * Returns a clean JSON error response without exposing stack traces.
 */
function errorHandler(err, req, res, next) {  // eslint-disable-line no-unused-vars
  console.error('[Error]', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Mongoose cast error (bad ObjectId etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  // Default to 500
  res.status(err.status || 500).json({ error: 'An unexpected error occurred' });
}

module.exports = errorHandler;
