function notFoundHandler(req, res) {
  res.status(404).json({
    error: "NotFound",
    message: "Resource not found"
  });
}

module.exports = { notFoundHandler };
