const pool = require("../config/db");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

class UserRepository {
  async CreateUser(email, password, fullName, role) {
    const result = await pool.query(
      "INSERT INTO users(email,password,full_name,role) VALUES($1,$2,$3,$4) RETURNING *",
      [email, password, fullName, role]
    );
    return result.rows[0];
  }

  async FindByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    return result.rows[0];
  }

  async login(email, password) {
    const result = pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = (await result).rows[0];
    if (!user) {
      return null;
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    const token = jwt.sign(
      {
        userid: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      token,
    };
  }
}

module.exports = new UserRepository();
