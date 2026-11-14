export const errorHandler = (err, req, res, next) => {
  console.error('[ErrorHandler]', err.stack || err.message || err);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
