const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    require: true,               // Enforces SSL
    rejectUnauthorized: false,   // Allows self-signed certs (common in Neon/Supabase)
  },
});

pool
  .connect()
  .then((client) => {
    console.log("✅ Connected to PostgreSQL database");
    client.release();
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err.message);
  });

module.exports = pool;
