const attendanceRepo = require("../repository/attendanceRepository");
const middleware = require("../middleware/auth");

async function addDailyAttendance(req, res) {
  const user = await middleware.foundClaims(req);
  if (!user) {
    return res.status(200).json({ root: "/unauthorized" });
  }
  const teacherId = user.role === "admin" ? 1 : user.id;
  const { classId, date, sessionId, sectionId } = req.body;
  const result = await attendanceRepo.addDailyAttendance(
    classId,
    date,
    sessionId,
    sectionId,
    teacherId
  );
  if (!result) {
    return res.status(500).json({
      message: "There is some error occured",
      success: false,
    });
  }
  return res.status(200).json({ data: result });
}

async function storeAttendance(req, res) {
  const { students } = req.body;
  const user = await middleware.foundClaims(req);
  if (!user) {
    return res.status(200).json({ root: "/unauthorized" });
  }
  let teacherId = user.role == "admin" ? 1 : user.id;
  const result = await attendanceRepo.storeAttendance(students, teacherId);
  if (result.success == false) {
    return res
      .status(210)
      .json({ message: "There is some error occured", success: false });
  }
  return res
    .status(200)
    .json({ message: "Stroed successfully", success: true });
}

async function viewStudent(req, res) {
  const { classId, sessionId } = req.body;
  const result = await attendanceRepo.viewStudent(classId, sessionId);
  if (!result) {
    return res.status(500).json({ message: "No rows found" });
  }
  return res.status(200).json({ data: result });
}

async function viewAttendance(req, res) {
  const { studentId } = req.body;
  const result = await attendanceRepo.viewAttendance(studentId);
  if (!result) {
    return res
      .status(500)
      .json({ message: "No records found", success: false });
  }
  return res.status(200).json({ data: result, success: true });
}

async function getAttendanceByStudent(req, res) {
  const { classId } = req.body;
  const user = await middleware.foundClaims(req);
  if (!user) {
    console.log(user);
    console.log("i am here");
    return res.status(230).json({ root: "/unauthorized" });
  }
  const studentId = await attendanceRepo.getStudentIdFromUserId(user.id);

  if (classId == null || classId == "") {
    const result = await attendanceRepo.getAttendanceByStudent(studentId[0].id);
    const simplifiedResult = result.map((item) => ({
      date: new Date(item.attendance_date).toLocaleDateString("en-CA"), // Format: YYYY-MM-DD
      status: item.status,
      remarks: item.remarks,
    }));

    return res
      .status(200)
      .json({ message: "got it ", data: simplifiedResult, user: user });
  }
  const result = await attendanceRepo.getAttendanceByClass(
    studentId[0].id,
    classId
  );
  const simplifiedResult = result.map((item) => ({
    date: new Date(item.attendance_date).toLocaleDateString("en-CA"), // Format: YYYY-MM-DD
    status: item.status,
    remarks: item.remarks,
  }));

  return res
    .status(200)
    .json({ message: "got it ", data: simplifiedResult, user: user });
}

async function getEnrolledClass(req, res) {
  const user = await middleware.foundClaims(req);
  if (!user) {
    return res.status(200).json({ root: "/unauthorized" });
  }
  const studentId = await attendanceRepo.getStudentIdFromUserId(user.id);
  const result = await attendanceRepo.getEnrolledClass(studentId[0].id);
  if (!result) {
    return res.status(220).json({ message: "Error found", success: false });
  }
  return res.status(200).json({ data: result, success: true });
}

module.exports = {
  addDailyAttendance,
  storeAttendance,
  viewAttendance,
  viewStudent,
  getAttendanceByStudent,
  getEnrolledClass,
};
