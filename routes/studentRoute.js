const express = require("express");
const router = express.Router();
const studetController = require("../controllers/studentController");

router.get("/profile", studetController.profile);
router.post("/getTemplates", studetController.getTemplatesByClass);
router.post(
  "/getStudentByClassAndSession",
  studetController.getStudentByClassAndSession
);
router.post("/assignCertificate", studetController.assignCertificate);

router.get(
  "/getAllAssignedCertificates",
  studetController.getAllAssignedCertificates
);

router.get(
  "/getCertificatesByStudent",
  studetController.getCertificatesByStudent
);

router.post("/updateStudentRollAndGender",studetController.updateStudentRollAndGender)

router.get("/verify", studetController.verifyCertificate);
module.exports = router;
