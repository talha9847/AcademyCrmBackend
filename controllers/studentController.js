const studentRepository = require("../repository/studentRepository");
const middleware = require("../middleware/auth");
const crypto = require("crypto");
const pool = require("../config/db");
const attendanceRepository = require("../repository/attendanceRepository");
const path = require("path");
const fs = require("fs");

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

async function updateEnrolledClasses(req, res) {
  const { eId, classId, sessionId } = req.body;
  const result = await studentRepository.updateEnrolledClasses(
    eId,
    classId,
    sessionId
  );
  if (!result) {
    return res
      .status(500)
      .json({ message: "there is some eroro", success: false });
  }
  return res.status(200).json({ success: true });
}

async function addEnrolledClasses(req, res) {
  try {
    const { classId, sessionId, userId } = req.body;
    const studentId = await attendanceRepository.getStudentIdFromUserId(userId);
    const result = await studentRepository.addEnrolledClasses(
      classId,
      sessionId,
      studentId[0].id
    );
    if (result < 1) {
      return res
        .status(500)
        .json({ success: false, message: "there is error occured" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "there is error occured" });
  }
}

async function deleteEnrolledClasses(req, res) {
  const { id } = req.body;
  const result = await studentRepository.deleteEnrolledClasses(id);
  if (result < 1) {
    return res.status(500).json({ success: false });
  }
  return res.status(200).json({ succees: true });
}

async function updatePI(req, res) {
  const { dob, address, status, contact, userId } = req.body;
  const studentId = await attendanceRepository.getStudentIdFromUserId(userId);
  const result = await studentRepository.updatePI(
    dob,
    address,
    status,
    contact,
    studentId[0].id
  );
  if (result < 1) {
    return res.status(500).json({ succees: false });
  }
  return res.status(200).json({ success: true });
}

async function updateStudentProfile(req, res) {
  try {
    const photo = req.files?.profilePhoto?.[0];
    const { email, userId } = req.body;

    if (!photo) {
      return res
        .status(400)
        .json({ message: "Profile photo is required", success: false });
    }
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];
    if (!allowedMimeTypes.includes(photo.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only images are allowed",
        success: false,
      });
    }

    const extension = path.extname(photo.originalname).toLowerCase();
    const photoName = `${email}_profile${extension}`;
    const uploadDir = path.join(__dirname, "..", "uploads");
    const fullPath = path.join(uploadDir, photoName);

    const previousPhotoQuery = await pool.query(
      "SELECT profile_photo FROM students WHERE user_id=$1",
      [userId]
    );
    const previousPhotoName = previousPhotoQuery.rows[0]?.profile_photo;
    if (previousPhotoName) {
      const previousPhotoPath = path.join(uploadDir, previousPhotoName);
      if (fs.existsSync(previousPhotoPath)) {
        fs.unlinkSync(previousPhotoPath);
      }
    }

    fs.writeFileSync(fullPath, photo.buffer);

    const query = await pool.query(
      "UPDATE students SET profile_photo=$1 WHERE user_id=$2",
      [photoName, userId]
    );

    if (query.rowCount < 1) {
      return res
        .status(500)
        .json({ message: "Failed to update student profile", success: false });
    }

    return res
      .status(200)
      .json({ message: "Profile updated successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
}

async function updateStudentSignature(req, res) {
  try {
    const { email, userId } = req.body;
    const photo = req.files.signaturePhoto?.[0];
    if (!photo) {
      return res
        .status(400)
        .json({ message: "Profile photo is required", success: false });
    }
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];
    if (!allowedMimeTypes.includes(photo.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only images are allowed",
        success: false,
      });
    }

    const extension = path.extname(photo.originalname).toLowerCase();
    const photoName = `${email}_signature${extension}`;
    const uploadDir = path.join(__dirname, "..", "uploads");
    const fullPath = path.join(uploadDir, photoName);

    const previousPhotoQuery = await pool.query(
      "SELECT signature_photo FROM students WHERE user_id=$1",
      [userId]
    );
    const previousPhotoName = previousPhotoQuery.rows[0]?.signature_photo;
    if (previousPhotoName) {
      const previousPhotoPath = path.join(uploadDir, previousPhotoName);
      if (fs.existsSync(previousPhotoPath)) {
        fs.unlinkSync(previousPhotoPath);
      }
    }

    fs.writeFileSync(fullPath, photo.buffer);

    const query = await pool.query(
      "UPDATE students SET signature_photo=$1 WHERE user_id=$2",
      [photoName, userId]
    );

    if (query.rowCount < 1) {
      return res
        .status(500)
        .json({ message: "Failed to update student profile", success: false });
    }

    return res
      .status(200)
      .json({ message: "Profile updated successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
}

async function statusUpdate(req, res) {
  const { status, userId } = req.body;
  try {
    const query = await pool.query(
      "UPDATE users SET is_active=$1 WHERE id=$2",
      [status, userId]
    );
    if (query.rowCount < 1) {
      return res
        .status(500)
        .json({ message: "some error occured", succees: false });
    }
    return res
      .status(200)
      .json({ message: "there is good thing", succees: true });
  } catch (error) {
    console.log(error);
    return res.status.json({ message: "Internal server error" });
  }
}

async function updateFee(req, res) {
  const { fee, userId } = req.body;

  const studentId = await attendanceRepository.getStudentIdFromUserId(userId);

  try {
    const query = await pool.query(
      "UPDATE student_fees SET total_fee=$1 WHERE student_id=$2",
      [fee, studentId[0].id]
    );
    if (query.rowCount < 1) {
      return res
        .status(500)
        .json({ message: "there is some error occured", success: false });
    }
    return res.status(200).json({ success: false, message: "good one" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "there is no", succees: false });
  }
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
  updateEnrolledClasses,
  addEnrolledClasses,
  deleteEnrolledClasses,
  updatePI,
  updateStudentProfile,
  updateStudentSignature,
  statusUpdate,
  updateFee,
};
