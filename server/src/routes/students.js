// server/src/routes/students.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studentsController');

// CRUD
router.post('/', ctrl.createStudent);
router.get('/', ctrl.getStudents);             // supports pagination ?page=&limit=
router.get('/:id', ctrl.getStudentById);       // returns student + marks
router.put('/:id', ctrl.updateStudent);
router.delete('/:id', ctrl.deleteStudent);

// optionally marks endpoints could be added too (create mark, delete mark, etc)

module.exports = router;
