const { getAllClasses } = require("../repository/extraRepository");
const userRepository = require("../repository/userRepository");
const path = require("path");
const fs = require("fs");
const pool = require("../config/db");

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
  const {
    fullName,
    email,
    classId,
    sectionId,
    admissionNumber,
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

  if (!fullName || fullName.trim() === "") {
    return res.status(400).json({ error: "Full name is required" });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "A valid email is required" });
  }

  if (!classId) {
    return res.status(400).json({ error: "Class ID is required" });
  }

  if (!admissionNumber) {
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
    admissionNumber,
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

module.exports = {
  GetAllStudents,
  createTeacher,
  createStudent,
  getStudentById,
  getAllTeachers,
  getTeacherById,
  getPhoto,
  getCerti,
};
