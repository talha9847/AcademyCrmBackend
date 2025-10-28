// upload.js
const multer = require("multer");

const storage = multer.memoryStorage(); // Save files in memory temporarily

const upload = multer({ storage });

module.exports = upload;
