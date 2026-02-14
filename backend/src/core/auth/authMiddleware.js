const { verifyAccessToken } = require("./jwtService");

function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing or invalid Authorization header"
    });
  }

  const token = header.slice("Bearer ".length);

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.sub, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired token"
    });
  }
}

module.exports = { requireAuth };
