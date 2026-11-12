/**
 * 404 Not Found Middleware
 * Returns consistent JSON response when an endpoint does not match any route
 */
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
};
