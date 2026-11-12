/**
 * Global Centralized Error Handling Middleware
 * Provides standardized JSON responses and maps Mongoose/MongoDB errors to correct HTTP status codes
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';
  let validationDetails = null;

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID format: '${err.value}' is not a valid MongoDB ObjectId`;
  }

  // 2. MongoDB Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    message = `An employee with that ${field} ('${value}') already exists`;
  }

  // 3. Mongoose Validation Error (ValidationError)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errorsMap = {};
    const messages = [];

    for (const key of Object.keys(err.errors)) {
      const errorItem = err.errors[key];
      errorsMap[key] = errorItem.message;
      messages.push(errorItem.message);
    }

    message = messages.join('. ');
    validationDetails = errorsMap;
  }

  // 4. Malformed JSON Body Error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON payload in request body';
  }

  // 5. Custom status code attached to error object
  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  const response = {
    success: false,
    message,
    ...(validationDetails && { errors: validationDetails }),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};
