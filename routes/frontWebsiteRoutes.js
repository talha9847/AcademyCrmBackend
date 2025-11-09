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
router.get(
  "/getAllAboutCoreVision",
  frontWebsiteController.getAllAboutCoreVision
);
router.post(
  "/updateAboutCoreMission",
  frontWebsiteController.updateAboutCoreMission
);
router.post(
  "/updateAboutCoreVision",
  frontWebsiteController.updateAboutCoreVision
);
router.post("/addAboutCoreMission", frontWebsiteController.addAboutCoreMission);
router.post("/addAboutCoreVision", frontWebsiteController.addAboutCoreVision);
router.get("/getMilestones", frontWebsiteController.getMilestones);
router.put("/updateMilestone", frontWebsiteController.updateMilestone);
router.post("/addMilestone", frontWebsiteController.addMilestone);
router.post("/deleteMilestone", frontWebsiteController.deleteMilestone);
router.get("/getGallery", frontWebsiteController.getGallery);
router.get("/getAllGallery", frontWebsiteController.getAllGallery);
router.get("/getBlogs", frontWebsiteController.getBlogs);
router.get("/getAllBlogs", frontWebsiteController.getAllBlogs);
router.post("/getCoursDetailById", frontWebsiteController.getCoursDetailById);
router.put("/updateCourseModule", frontWebsiteController.updateCourseModule);
router.put(
  "/updateCourseDescription",
  frontWebsiteController.updateCourseDescription
);
router.put(
  "/updateCourseInstructor",
  frontWebsiteController.updateCourseInstructor
);
router.post("/deleteCourse", frontWebsiteController.deleteCourse);

module.exports = router;
