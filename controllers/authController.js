const userRepository = require("../repository/userRepository");

async function login(req, res) {
  const { email, password } = req.body;
  console.log(email);
  const user = await userRepository.login(email, password);

  if (!user) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
  res.json(user);
}
module.exports = { login };
