const jwt = require("jsonwebtoken");
function authMiddleware(roles = []) {
  if (typeof roles === "string") {
    roles = [roles];
  }
  return async (req, res, next) => {
    // Read token from cookie named 'token'
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token found in cookies" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

async function foundClaims(req) {
  const token = req.cookies.token;
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

module.exports = {
  authMiddleware,
  foundClaims,
};
