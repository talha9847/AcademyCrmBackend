const studentRepository = require("../repository/studentRepository");
const middleware = require("../middleware/auth");

async function profile(req, res) {
  const user = await middleware.foundClaims(req);
  if (!user) {
    return res.status(210).json({ root: "/unauthorized" });
  }
  const result = await studentRepository.getProfileDetail(user.id);
  if (!result) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
  return res.status(200).json({ data: result[0], success: true });
}

async function getTemplatesByClass(req, res) {
  const { classId } = req.body;
  console.log(classId);
  const result = await studentRepository.getTemplatesByClass(classId);
  if (!result) {
    return res
      .status(500)
      .json({ message: "There is some error occured", success: false });
  }
  return res.status(200).json({ success: true, data: result });
}

async function getStudentByClassAndSession(req, res) {
  const { classId, sessionId } = req.body;

  const result = await studentRepository.getStudentByClassAndSession(
    classId,
    sessionId
  );
  if (!result) {
    return res
      .status(500)
      .json({ message: "There is some error occured", success: false });
  }
  return res.status(200).json({ data: result, success: true });
}
module.exports = { profile, getTemplatesByClass, getStudentByClassAndSession };
