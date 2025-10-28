const express = require("express");
const router = express.Router();
const studetController = require("../controllers/studentController");

router.get("/profile", studetController.profile);
router.post("/getTemplates", studetController.getTemplatesByClass);
router.post("/getStudentByClassAndSession", studetController.getStudentByClassAndSession);

module.exports = router;
