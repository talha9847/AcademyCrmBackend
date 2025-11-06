const express = require("express");
const router = express.Router();
const frontWebsiteController = require("../controllers/frontWebsiteController");
const authMiddleware = require("../middleware/auth");

router.get("/getCourses", frontWebsiteController.getCourses);
router.post("/addCourse", frontWebsiteController.addCourse);
router.post("/updateCourse", frontWebsiteController.updateCourseById);
router.get("/getAllCourses", frontWebsiteController.getAllCourses);
router.get("/getHeroData", frontWebsiteController.getHeroSectionData);
router.post("/updateHeroData", frontWebsiteController.updateHeroData);
router.post("/sendUsMessage", frontWebsiteController.sendUsMessage);
router.get("/getAboutPageSection", frontWebsiteController.getAboutPageSection);
router.get("/aboutCoreVision", frontWebsiteController.aboutCoreVision);
router.get("/aboutCoreMission", frontWebsiteController.aboutCoreMission);
router.get("/getTestimonials", frontWebsiteController.getTestimonials);
router.get("/getAllTestimonials", frontWebsiteController.getAllTestimonials);
router.post("/updateTestimonials", frontWebsiteController.updateTestimonials);
router.post(
  "/updateTestimonialToggle",
  frontWebsiteController.updateTestimonialToggle
);
router.post("/deleteTestimonial", frontWebsiteController.deleteTestimonial);
router.post("/addTestimonial", frontWebsiteController.addTestimonial);
router.post("/updateAboutSection", frontWebsiteController.updateAboutSection);
router.get("/getAboutCoreMission", frontWebsiteController.getAboutCoreMission);
router.post(
  "/updateAboutCoreMission",
  frontWebsiteController.updateAboutCoreMission
);
router.post("/addAboutCoreMission", frontWebsiteController.addAboutCoreMission);

module.exports = router;
