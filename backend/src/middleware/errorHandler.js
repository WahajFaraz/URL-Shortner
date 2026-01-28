export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    err.statusCode = 400;
    err.message = Object.values(err.errors)
      .map((error) => error.message)
      .join(', ');
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err.statusCode = 409;
    err.message = `${field} already exists`;
  }

  if (err.name === 'CastError') {
    err.statusCode = 400;
    err.message = 'Invalid ID format';
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
