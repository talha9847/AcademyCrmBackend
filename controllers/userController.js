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

    const result = await userRepository.CreateStudent(fullName, email, classId, sectionId, admissionNumber, dob, gender, rollNo, sessionId, address, totalFee, dueDate, discount, description, p_name, p_phone, p_email, p_relation, p_occupation, p_address);

    if (!result) {
        return res.status(500).json({ success: false, message: "Something went wrong while creating the student." })
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

module.exports = {  GetAllStudents, createTeacher, createStudent, getStudentById, getAllTeachers };