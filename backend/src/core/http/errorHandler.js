const { ZodError } = require("zod");

function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "ValidationError",
      message: "Invalid request data",
      details: err.flatten()
    });
  }

  // MongoDB duplicate key (E11000) - show user-friendly message
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "";
    const friendly = field === "email"
      ? "This email is already registered. Please sign in or use a different email."
      : "Registration failed. This email may already be in use. Please sign in or try a different email.";
    return res.status(409).json({
      error: "DuplicateError",
      message: friendly
    });
  }

  // MongoDB geo / validation errors
  if (err.message && err.message.includes("Can't extract geo keys")) {
    return res.status(400).json({
      error: "ValidationError",
      message: "Invalid location format. Please try again without location or contact support."
    });
  }

  const status = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";
  const message = isProd ? "Something went wrong. Please try again." : err.message || "Unknown error";

  console.error("Unhandled error:", err);

  res.status(status).json({
    error: "HttpError",
    message
  });
}

module.exports = { errorHandler };
