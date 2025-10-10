const { getAllClasses } = require('../repository/extraRepository');
const userRepository = require('../repository/userRepository');



async function GetAllStudents(req, res) {
    const result = await userRepository.GetAllStudents();
    if (!result) {
        return res.status(404).json({ message: "Students not found" });
    }
    return res.json({ result: result, message: "Students found successfully" });
}

async function createTeacher(req, res) {
    const { fullName, email, hireDate, department } = req.body;
    const result = await userRepository.CreateTeacher(fullName, email, hireDate, department);
    if (!result) {
        return res.status(500).json({ message: "Something went wrong while creating the teacher." });
    }
    return res.status(201).json({ success: true, message: "Teacher added successfully", data: result });
}

async function createStudent(req, res) {
    const { fullName, email, classId, sectionId, admissionNumber, dob, gender, rollNo, sessionId, address, totalFee, dueDate, discount, description, p_name, p_phone, p_email, p_relation, p_occupation, p_address } = req.body;

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
        return res.status(400).json({ error: "Valid 10-digit parent phone number required" });
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



    const result = await userRepository.CreateStudent(fullName, email, classId, sectionId, admissionNumber, dob, gender, rollNo, sessionId, address, totalFee, dueDate, discount, description, p_name, p_phone, p_email, p_relation, p_occupation, p_address);

    if (!result.success) {
        return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(201).json({
        data: result,
        message: "Student added successfully",
        success: true
    })
}

async function getAllTeachers(req, res) {
    const result = await userRepository.getAllTeachers();
    if (!result) {
        return res.status(500).json({ message: "There is something wrong" });
    }
    return res.status(200).json({ data: result })
}

async function getStudentById(req, res) {
    const { id } = req.query;
    const result = await userRepository.getStudentById(id);
    if (!result) {
        return res.status(500).json({ message: "There is something not good" });
    }
    return res.status(200).json({ data: result });
}

module.exports = { GetAllStudents, createTeacher, createStudent, getStudentById, getAllTeachers };