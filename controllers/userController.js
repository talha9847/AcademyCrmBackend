const { getAllClasses } = require("../repository/extraRepository");
const userRepository = require("../repository/userRepository");
const path = require("path");
const fs = require("fs");
const pool = require("../config/db");
const authMiddleware = require("../middleware/auth");
const { pid } = require("process");
const bcrypt = require("bcrypt");

async function GetAllStudents(req, res) {
  const result = await userRepository.GetAllStudents();
  if (!result) {
    return res.status(404).json({ message: "Students not found" });
  }
  return res.json({ result: result, message: "Students found successfully" });
}

async function createTeacher(req, res) {
  try {
    const {
      fullName,
      email,
      hireDate,
      department,
      gender,
      birthdate,
      designation,
      address,
    } = req.body;
    const photo = req.files.profilePhoto[0];
    let staffId;

    try {
      const query = await pool.query("SELECT 1 FROM users WHERE email = $1", [
        email,
      ]);

      if (query.rows.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    try {
      const query = await pool.query(
        "SELECT staff_id FROM teachers ORDER BY created_at DESC LIMIT 1"
      );
      const previousStaffId = query.rows[0].staff_id;
      const prefix = previousStaffId.match(/^[A-Za-z-]+/)[0];
      const numberPart = previousStaffId.match(/\d+$/)[0];
      const newNumber = (parseInt(numberPart, 10) + 1)
        .toString()
        .padStart(numberPart.length, "0");
      const newStaffId = `${prefix}${newNumber}`;
      staffId = newStaffId;
    } catch (error) {
      console.log(error);
    }
    // --- Basic field presence validation ---
    if (!photo) {
      return res
        .status(400)
        .json({ message: "Profile photo is required", success: false });
    }

    if (!fullName) {
      return res
        .status(400)
        .json({ message: "Name fields are required", success: false });
    }
    if (!email) {
      return res
        .status(400)
        .json({ message: "email fields are required", success: false });
    }
    if (!hireDate) {
      return res
        .status(400)
        .json({ message: "hireDate fields are required", success: false });
    }
    if (!department) {
      return res
        .status(400)
        .json({ message: "department fields are required", success: false });
    }
    if (!gender) {
      return res
        .status(400)
        .json({ message: "gender fields are required", success: false });
    }
    if (!staffId) {
      return res
        .status(400)
        .json({ message: "staffId fields are required", success: false });
    }
    if (!designation) {
      return res
        .status(400)
        .json({ message: "designation fields are required", success: false });
    }
    if (!address) {
      return res
        .status(400)
        .json({ message: "address fields are required", success: false });
    }

    console.log(birthdate);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format", success: false });
    }

    const validGenders = ["male", "female", "other"];
    if (!validGenders.includes(gender.toLowerCase())) {
      return res
        .status(400)
        .json({ message: "Invalid gender value", success: false });
    }

    const isValidDate = (dateStr) => !isNaN(Date.parse(dateStr));
    if (!isValidDate(hireDate) || !isValidDate(birthdate)) {
      return res
        .status(400)
        .json({ message: "Invalid date format", success: false });
    }

    const extension = path.extname(req.files.profilePhoto[0].originalname);
    const nameToStore = `${email}_profile${extension}`;
    console.log(req.files.profilePhoto[0]);
    const uploadDir = path.join(__dirname, "..", "uploads");
    const fullPath = path.join(uploadDir, nameToStore);

    console.log(res.status);
    console.log(fullPath);
    const result = await userRepository.CreateTeacher(
      fullName,
      email,
      hireDate,
      department,
      gender,
      birthdate,
      staffId,
      designation,
      address,
      nameToStore
    );
    if (!result) {
      return res.status(500).json({
        message: "Something went wrong while creating the teacher.",
        success: false,
      });
    }
    if (result.userId > 0) {
      fs.writeFileSync(fullPath, photo.buffer);
      return res.status(200).json({ message: "Done", success: true });
    }
    return res.status(500).json({
      success: false,
      message: "Teacher added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error added successfully",
    });
  }
}

async function createStudent(req, res) {
  try {
    let newAdmissionNumber = "";
    const {
      fullName,
      email,
      classId,
      sectionId,
      dob,
      gender,
      rollNo,
      sessionId,
      address,
      totalFee,
      dueDate,
      discount,
      description,
      p_name,
      p_phone,
      p_email,
      p_relation,
      p_occupation,
      p_address,
      enrollments,
      mobile,
    } = req.body;
    const query = await pool.query(
      `SELECT admission_number FROM students ORDER BY created_at DESC LIMIT 1`
    );
    const prefix = "MCA-ADM";
    const currentYear = new Date().getFullYear();

    if (query.rows.length > 0) {
      const lastAdm = query.rows[0].admission_number; 

      // Split format: PREFIX-YEAR-SERIAL
      const parts = lastAdm.split("-");
      const lastYear = parseInt(parts[2]);
      const lastSerial = parseInt(parts[3]);

      if (lastYear === currentYear) {
        const newSerial = String(lastSerial + 1).padStart(3, "0");
        newAdmissionNumber = `${prefix}-${currentYear}-${newSerial}`;
      } else {
        newAdmissionNumber = `${prefix}-${currentYear}-001`;
      }
    } else {
      newAdmissionNumber = `${prefix}-${currentYear}-001`;
    }

    if (!fullName || fullName.trim() === "") {
      return res.status(400).json({ error: "Full name is required" });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "A valid email is required" });
    }

    if (!classId) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    if (!newAdmissionNumber) {
      return res.status(400).json({ error: "Admission number is required" });
    }

    if (!dob || isNaN(Date.parse(dob))) {
      return res.status(400).json({ error: "Valid date of birth is required" });
    }

    if (!gender) {
      return res.status(400).json({ error: "Valid gender is required" });
    }

    if (!rollNo || isNaN(rollNo)) {
      return res.status(400).json({ error: "Valid roll number is required" });
    }

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    if (!address || address.trim() === "") {
      return res.status(400).json({ error: "Address is required" });
    }

    if (!totalFee || isNaN(totalFee)) {
      return res.status(400).json({ error: "Total fee must be a number" });
    }

    if (!dueDate || isNaN(Date.parse(dueDate))) {
      return res.status(400).json({ error: "Valid due date is required" });
    }

    if (discount && isNaN(discount)) {
      return res.status(400).json({ error: "Discount must be a number" });
    }

    if (!p_name || p_name.trim() === "") {
      return res.status(400).json({ error: "Parent name is required" });
    }

    if (!p_phone) {
      return res
        .status(400)
        .json({ error: "Valid 10-digit parent phone number required" });
    }

    if (p_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p_email)) {
      return res.status(400).json({ error: "Parent email is invalid" });
    }

    if (!p_relation || p_relation.trim() === "") {
      return res.status(400).json({ error: "Parent relation is required" });
    }

    if (!p_address || p_address.trim() === "") {
      return res.status(400).json({ error: "Parent address is required" });
    }

    const photo = req.files?.photoUrl?.[0];
    const signature = req.files?.signatureUrl?.[0];

    if (!photo || !signature) {
      return res
        .status(400)
        .json({ error: "Both photo and signature are required." });
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedMimeTypes.includes(photo.mimetype)) {
      return res
        .status(400)
        .json({ error: "Invalid photo format. Only image files are allowed." });
    }

    if (!allowedMimeTypes.includes(signature.mimetype)) {
      return res.status(400).json({
        error: "Invalid signature format. Only image files are allowed.",
      });
    }
    const photoExt = path.extname(photo.originalname).toLowerCase();
    const signatureExt = path.extname(signature.originalname).toLowerCase();

    const profileName = `${email}_profile${photoExt}`;
    const signatureName = `${email}_signature${signatureExt}`;

    const result = await userRepository.CreateStudent(
      fullName,
      email,
      classId,
      sectionId,
      newAdmissionNumber,
      dob,
      gender,
      rollNo,
      sessionId,
      address,
      totalFee,
      dueDate,
      discount,
      description,
      p_name,
      p_phone,
      p_email,
      p_relation,
      p_occupation,
      p_address,
      profileName,
      signatureName,
      enrollments,
      mobile
    );
    if (result.success == false) {
      return res.status(400).json({ success: false, message: result.message });
    }
    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const photoPath = path.join(uploadDir, profileName);
    const signaturePath = path.join(uploadDir, signatureName);
    try {
      fs.writeFileSync(photoPath, photo.buffer);
      fs.writeFileSync(signaturePath, signature.buffer);

      return res.status(201).json({
        data: result,
        message: "Student added successfully",
        success: true,
      });
    } catch (err) {
      console.error("Error saving files:", err);
      return res.status(500).json({ error: "Failed to save files." });
    }
  } catch (error) {
    console.error("Error saving files:", error);
    return res.status(500).json({ error: "Failed to save files." });
  }
}

async function getAllTeachers(req, res) {
  const result = await userRepository.getAllTeachers();
  if (!result) {
    return res.status(500).json({ message: "There is something wrong" });
  }
  return res.status(200).json({ data: result });
}

async function getStudentById(req, res) {
  const { id } = req.query;
  const result = await userRepository.getStudentById(id);
  if (!result) {
    return res
      .status(500)
      .json({ message: "There is something not good", success: false });
  }
  return res.status(200).json({ data: result, success: true });
}

async function getTeacherById(req, res) {
  const { userId } = req.body;
  try {
    const result = await userRepository.getTeacherById(userId);
    if (!result) {
      return res
        .status(500)
        .json({ message: "There is some erro", success: false });
    }
    return res
      .status(200)
      .json({ message: "Successfull", success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is some erro", success: false });
  }
}

async function getPhoto(req, res) {
  const { fileName } = req.params;
  try {
    const filePath = path.join(__dirname, "..", "uploads", fileName);
    res.sendFile(filePath);
  } catch (error) {
    console.log(error);
  }
}

async function getCerti(req, res) {
  try {
    const filePath = path.join(__dirname, "..", req.params[0]);
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(500).json({ message: "Error fetching certificate" });
  }
}
async function getCertiPhoto(req, res) {
  try {
    const fileName = decodeURIComponent(req.params[0]);
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "certi_profile",
      fileName
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(500).json({ message: "Error fetching certificate" });
  }
}

async function getTeacherProfile(req, res) {
  try {
    const user = await authMiddleware.foundClaims(req);
    if (!user) {
      return res.status(230).json({ message: "/unauthorized", success: false });
    }
    const result = await userRepository.getTeacherProfile(user.id);
    if (!result) {
      return res.status(500).json({ message: "Error Found", success: false });
    }
    return res
      .status(200)
      .json({ success: true, message: "Success", data: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error Found", success: false });
  }
}

async function updateDobAndContactOfTeacher(req, res) {
  const { dob, contact, teacherId } = req.body;

  try {
    const query = await pool.query(
      "UPDATE teachers SET birthdate=$1,mobile=$2 WHERE user_id=$3",
      [dob, contact, teacherId]
    );
    if (query.rowCount < 1) {
      return res.status(500).json({ message: "Error", success: false });
    }
    console.log(query.rowCount);
    return res.status(200).json({ message: "Updated", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Error", success: false });
  }
}
async function updateGenderAndAddressOfTeacher(req, res) {
  const { address, gender, teacherId } = req.body;

  try {
    const query = await pool.query(
      "UPDATE teachers SET gender=$1,address=$2 WHERE user_id=$3",
      [gender, address, teacherId]
    );
    if (query.rowCount < 1) {
      return res.status(500).json({ message: "Error", success: false });
    }
    console.log(query.rowCount);
    return res.status(200).json({ message: "Updated", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Error", success: false });
  }
}
async function updateHireDateAndDesignationOfTeacher(req, res) {
  const { hireDate, designation, teacherId } = req.body;

  try {
    const query = await pool.query(
      "UPDATE teachers SET hire_date=$1,designation=$2 WHERE user_id=$3",
      [hireDate, designation, teacherId]
    );
    if (query.rowCount < 1) {
      return res.status(500).json({ message: "Error", success: false });
    }
    console.log(query.rowCount);
    return res.status(200).json({ message: "Updated", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Error", success: false });
  }
}

async function updateTeacherProfile(req, res) {
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
      "SELECT profile_photo FROM teachers WHERE user_id=$1",
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
      "UPDATE teachers SET profile_photo=$1 WHERE user_id=$2",
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
async function changeAdminPassword(req, res) {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res
      .status(500)
      .json({ messsage: "All fields are required", success: false });
  }

  if (newPassword !== confirmNewPassword) {
    return res
      .status(233)
      .json({ messsage: "Password do not match", success: false });
  }

  try {
    const user = await authMiddleware.foundClaims(req);
    if (!user) {
      return res.status(234).json({ message: "Sorry", success: false });
    }
    const firstQuery = await pool.query(
      "SELECT password FROM users WHERE id=$1",
      [user.id]
    );
    const compare = await bcrypt.compare(
      currentPassword,
      firstQuery.rows[0].password
    );
    if (!compare) {
      return res.status(240).json({ message: "Current password is not valid" });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    const query = await pool.query("UPDATE users SET password=$1 WHERE id=$2", [
      hashed,
      user.id,
    ]);
    if (query.rowCount < 1) {
      return res.status.json({ message: "Error occured", success: false });
    }
    return res
      .status(200)
      .json({ message: "Changed successfully", success: true });
  } catch (error) {
    return res.status.json({ message: "Error occured", success: false });
  }
}

module.exports = {
  GetAllStudents,
  createTeacher,
  createStudent,
  getStudentById,
  getAllTeachers,
  getTeacherById,
  getPhoto,
  getCerti,
  getCertiPhoto,
  getTeacherProfile,
  updateDobAndContactOfTeacher,
  updateGenderAndAddressOfTeacher,
  updateHireDateAndDesignationOfTeacher,
  updateTeacherProfile,
  changeAdminPassword,
};
