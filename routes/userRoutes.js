const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middleware/auth");
const upload = require("../middleware/upload");
const studentRepository = require("../repository/studentRepository");

router.get("/getAllTeachers", userController.getAllTeachers);
router.get(
  "/getAllStudents",
  authMiddleware(["admin", "teacher"]),
  userController.GetAllStudents
);
router.post(
  "/createTeacher",
  upload.fields([
    {
      name: "profilePhoto",
      maxCount: 1,
    },
  ]),
  userController.createTeacher
);
router.post(
  "/createStudent",
  authMiddleware(["admin", "teacher"]),
  upload.fields([
    { name: "photoUrl", maxCount: 1 },
    { name: "signatureUrl", maxCount: 1 },
  ]),
  userController.createStudent
);
router.get("/getStudentDetail", userController.getStudentById);
router.post("/getTeacherById", userController.getTeacherById);
router.get("/getPhoto/:fileName", userController.getPhoto);
router.get("/getCerti/*", userController.getCerti);
router.get("/getCertiPhoto/*", userController.getCertiPhoto);
router.get(
  "/getTeacherProfile*",
  authMiddleware(["teacher"]),
  userController.getTeacherProfile
);
router.put(
  "/updateDobAndContactOfTeacher",
  userController.updateDobAndContactOfTeacher
);

router.put(
  "/updateGenderAndAddressOfTeacher",
  userController.updateGenderAndAddressOfTeacher
);
router.put(
  "/updateHireDateAndDesignationOfTeacher",
  userController.updateHireDateAndDesignationOfTeacher
);
router.put(
  "/updateTeacherProfile",
  upload.fields([
    {
      name: "profilePhoto",
      maxCount: 1,
    },
  ]),
  userController.updateTeacherProfile
);

module.exports = router;
