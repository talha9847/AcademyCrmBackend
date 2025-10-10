const extras = require('../controllers/extraController');
var express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth')

router.get("/getClasses", authMiddleware.authMiddleware("admin"), extras.getAllClasses)
router.get("/getSessions", authMiddleware.authMiddleware("admin"), extras.getAllSessions)
router.get("/getSections", authMiddleware.authMiddleware("admin"), extras.getAllSections)
router.get("/getSectionById", authMiddleware.authMiddleware("admin"), extras.getSectionById)

module.exports = router;
