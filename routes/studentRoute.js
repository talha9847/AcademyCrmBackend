const express = require("express");
const router = express.Router();
const studetController = require("../controllers/studentController");
const upload = require("../middleware/upload");

router.get("/profile", studetController.profile);
router.post("/getTemplates", studetController.getTemplatesByClass);
router.get("/getAllTemplates", studetController.getAllTemplates);
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

router.post(
  "/updateStudentRollAndGender",
  studetController.updateStudentRollAndGender
);

router.get("/verify", studetController.verifyCertificate);

router.post("/updateEnrolledClasses", studetController.updateEnrolledClasses);
router.post("/addEnrolledClasses", studetController.addEnrolledClasses);
router.post("/deleteEnrolledClasses", studetController.deleteEnrolledClasses);
router.post("/updatePI", studetController.updatePI);

router.post(
  "/updateStudentProfile",
  upload.fields([
    {
      name: "profilePhoto",
      maxCount: 1,
    },
  ]),
  studetController.updateStudentProfile
);
router.post(
  "/updateStudentSignature",
  upload.fields([
    {
      name: "signaturePhoto",
      maxCount: 1,
    },
  ]),
  studetController.updateStudentSignature
);

router.post("/statusUpdate", studetController.statusUpdate);
router.post("/updateFee", studetController.updateFee);
router.post("/changePassword", studetController.changePassword);
router.post("/changePasswordByAdmin", studetController.changePasswordByAdmin);
router.get("/getDashboardData", studetController.getDashboardData);

module.exports = router;
