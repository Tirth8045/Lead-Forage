const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join("; ");
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value for ${field}`;
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  console.error(`[ERROR] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
