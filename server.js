const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const seedDefaultUser = require("./seeds/seedDefaultUser"); // imports the function

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
app.use(express.json());

seedDefaultUser();

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
