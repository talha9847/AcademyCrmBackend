const studentRepository = require("../repository/studentRepository");
const middleware = require("../middleware/auth");
const crypto = require("crypto");
const pool = require("../config/db");

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

async function generateCertificateNumber() {
  const year = new Date().getFullYear();
  const query = await pool.query(
    "SELECT certificate_number FROM certificates ORDER BY created_at DESC LIMIT 1"
  );
  const result = query.rows[0].certificate_number;

  let newNumber = 1;
  if (result) {
    const lastCert = result;
    const lastYear = lastCert.substring(3, 7);
    const lastSeq = parseInt(lastCert.split("-")[1]);

    if (parseInt(lastYear) === year) {
      newNumber = lastSeq + 1;
    } else {
      newNumber = 1;
    }
  }
  const formatted = String(newNumber).padStart(3, "0");
  return `MCA${year}-${formatted}`;
}

async function generateVerificationCode() {
  let result;
  let exists = true;

  while (exists) {
    result = crypto.randomBytes(9).toString("hex").toUpperCase();
    const check = await pool.query(
      "SELECT 1 FROM certificates WHERE verification_code = $1",
      [result]
    );
    exists = check.rowCount > 0;
  }

  return result;
}

async function assignCertificate(req, res) {
  try {
    const { recipientId, title, templateId } = req.body;
    const user = await middleware.foundClaims(req);
    if (!user) {
      return res.status(210).json({ root: "/unauthorized", success: false });
    }
    const alreadyAssigned = await studentRepository.alreadyAssigned(
      templateId,
      recipientId
    );
    if (alreadyAssigned) {
      return res.status(245).json({ success: false });
    }
    const issued_by = user.id;
    const description = "This is for test";
    const certificate_number = await generateCertificateNumber();
    const verification_code = await generateVerificationCode();
    if (templateId == null || templateId == "") {
      return res.status(500).json({ message: "template id not found" });
    }
    const result = await studentRepository.assignCertificate(
      certificate_number,
      verification_code,
      recipientId,
      title,
      description,
      issued_by,
      templateId
    );
    if (result < 1) {
      return res.status(500).json({ success: false });
    }
    return res.status(200).json({ message: "Ok got it", success: true });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getAllAssignedCertificates(req, res) {
  const result = await studentRepository.getAllAssignedCertificates();
  if (!result) {
    return res.status(500).json({ success: false });
  }
  return res.status(200).json({ success: true, data: result });
}

async function verifyCertificate(req, res) {
  const { code } = req.query;
  if (!code)
    return res.status(400).json({ success: false, message: "Missing code" });
  const result = await studentRepository.verifyCertificate(code);
  if (!result) {
    return res.status(500).json({ success: false });
  }
  return res.status(200).json({ data: result, success: true });
}

async function getCertificatesByStudent(req, res) {
  const user = await middleware.foundClaims(req);
  if (!user) {
    return res.status(240).json({ message: "You are not authorized" });
  }
  const result = await studentRepository.getCertificatesByStudent(user.id);
  if (!result) {
    return res
      .status(500)
      .json({ message: "There is some error", success: false });
  }
  return res.status(200).json({ success: true, data: result });
}

async function updateStudentRollAndGender(req, res) {
  const { rollNo, gender, studentId } = req.body;
  const result = await studentRepository.updateStudentRollAndGender(
    rollNo,
    gender,
    studentId
  );
  if (!result) {
    return res
      .status(500)
      .json({ success: false, message: "There is some error occured" });
  }
  return res.status(200).json({ message: "noise try" });
}

module.exports = {
  profile,
  getTemplatesByClass,
  getStudentByClassAndSession,
  assignCertificate,
  getAllAssignedCertificates,
  verifyCertificate,
  getCertificatesByStudent,
  updateStudentRollAndGender,
};
