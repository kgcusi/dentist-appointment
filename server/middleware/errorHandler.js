// src/middleware/errorHandler.js
export default (err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    error: 'Server Error',
    message: err.message
  });
};
