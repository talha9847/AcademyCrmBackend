const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool
  .connect()
  .then((client) => {
    console.log("Connected to PostgreSQL database");
    client.release(); // release the client back to the pool
  })
  .catch((err) => {
    console.error("PostgreSQL connection error", err.stack);
  });

module.exports = pool;
