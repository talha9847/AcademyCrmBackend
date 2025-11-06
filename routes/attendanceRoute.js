const attendanceController = require("../controllers/attendanceController");
const express = require("express");
const router = express.Router();

router.post("/addAttendance", attendanceController.addDailyAttendance);
router.post("/storeAttendance", attendanceController.storeAttendance);
router.post("/viewAttendance", attendanceController.viewAttendance);
router.post("/viewStudent", attendanceController.viewStudent);
router.post(
  "/getAttendanceByStudent",
  attendanceController.getAttendanceByStudent
);
router.get("/getEnrolledClass", attendanceController.getEnrolledClass);
module.exports = router;
