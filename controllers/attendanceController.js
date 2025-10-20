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
    console.log(" i am in the era of the ock kjfl j fkl dkjdflk jlkfjdlk jlkdsafjlkdsaj lkf")
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
  console.log(studentId);
  const result = await attendanceRepo.viewAttendance(studentId);
  if (!result) {
    return res
      .status(500)
      .json({ message: "No records found", success: false });
  }
  return res.status(200).json({ data: result, success: true });
}

module.exports = {
  addDailyAttendance,
  storeAttendance,
  viewAttendance,
  viewStudent,
};
