const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
  }

  if (err.isJoi) {
    return res.status(400).json({
      status: "fail",
      errors: err.details.map((detail) => ({ message: detail.message })),
    });
  }

  console.error("Unexpected error:", err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong on the server",
  });
};

module.exports = errorHandler;
