// server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const generateCertificate = require("./controllers/extraController");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const slugRoutes = require("./routes/slugRoutes");
const extraRoutes = require("./routes/extraRoutes");
const feesRoutes = require("./routes/feesRoute");
const frontRoutes = require("./routes/frontWebsiteRoutes");
const attendanceRoutes = require("./routes/attendanceRoute");

const seedDefaultUser = require("./seeds/seedDefaultUser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

seedDefaultUser();
// generateCertificate.generateCertificate("Talha Malek");

// -----------------------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user", slugRoutes);
app.use("/api/extras", extraRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/front", frontRoutes);
app.use("/api/attendance", attendanceRoutes);

// -----------------------
// Start Server
// -----------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
