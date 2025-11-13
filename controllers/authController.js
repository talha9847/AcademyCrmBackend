const userRepository = require("../repository/userRepository");
const authMiddleware = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function login(req, res) {
  const { email, password } = req.body;
  const user = await userRepository.login(email, password);
  if (!user) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
  console.log(user)

  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "30d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return res.json({ role: user.role, name: user.fullName, email: user.email });
}

async function checkAccess(req, res) {
  const { slug } = req.body;
  const user = await authMiddleware.foundClaims(req);
  if (!user) {
    return res.status(401).json({ message: "We are sorry this time" });
  }
  const result = await pool.query(
    "SELECT p.name, p.slug FROM pages p JOIN user_page_access u ON u.page_id=p.id WHERE u.user_id=$1 and u.is_enabled='true'",
    [user.id]
  );

  const allowedSlugs = result.rows.map((p) => p.slug);
  if (!allowedSlugs.includes(slug)) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json({ message: "Access granted" });
}

async function checkRoleAccess(req, res) {
  const { role } = req.body;
  console.log(role);
  const user = await authMiddleware.foundClaims(req);
  console.log(user);
  if (!user) {
    return res.status(401).json({ message: "User not logged in" });
  }
  if (user.role != role) {
    return res.status(403).json({ message: "Access denied", role: user.role });
  }
  return res.json({ message: "Access granted" });
}

module.exports = { login, checkAccess, checkRoleAccess };
