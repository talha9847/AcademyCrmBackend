const express = require('express');
const router = express.Router();
const frontWebsiteController = require('../controllers/frontWebsiteController');
const authMiddleware = require('../middleware/auth')

router.get("/getCourses", frontWebsiteController.getCourses)
router.post("/addCourse", frontWebsiteController.addCourse)
router.post("/updateCourse", frontWebsiteController.updateCourseById)
router.get("/getAllCourses", frontWebsiteController.getAllCourses)
router.get("/getHeroData", frontWebsiteController.getHeroSectionData)
router.post("/updateHeroData", frontWebsiteController.updateHeroData)
router.post("/sendUsMessage", frontWebsiteController.sendUsMessage)

module.exports = router;