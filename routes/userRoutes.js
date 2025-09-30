const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const { authMiddleware } = require('../middleware/auth');

router.get('/getAllTeachers', userController.getAllTeachers)
router.get('/getAllStudents', authMiddleware(['admin', 'teacher']), userController.GetAllStudents)
router.post('/createTeacher', userController.createTeacher);
router.post('/createStudent', userController.createStudent);
router.get('/getStudentDetail', userController.getStudentById);

module.exports = router;