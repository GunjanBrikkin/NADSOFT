// server/src/controllers/studentsController.js
const db = require('../db');

// Create new student (and optionally marks)
exports.createStudent = async (req, res) => {
  try {
    const { first_name, last_name, email, dob, marks } = req.body;

     let formattedDob;
    try {
      // This will throw if the date is invalid
      formattedDob = new Date(dob).toISOString();
    } catch (e) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid date format. Please use YYYY-MM-DD" 
      });
    }

    const insertStudent = `INSERT INTO students (first_name, last_name, email, dob)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const studentRes = await db.query(insertStudent, [first_name, last_name, email, formattedDob]);
    const student = studentRes.rows[0];

    if (Array.isArray(marks) && marks.length) {
      const markPromises = marks.map(m =>
        db.query(
          `INSERT INTO marks (student_id, subject, marks, term) VALUES ($1,$2,$3,$4)`,
          [student.id, m.subject, m.marks, m.term || null]
        )
      );
      await Promise.all(markPromises);
    }

    res.status(201).json({ success: true, student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Retrieve paginated students
exports.getStudents = async (req, res) => {
  try {
    // parse pagination params
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;

    // optional search or sort can be added via query params
    const totalRes = await db.query('SELECT COUNT(*) FROM students');
    const total = parseInt(totalRes.rows[0].count, 10);

    const rows = await db.query(
      `SELECT id, first_name, last_name, email, dob, created_at FROM students ORDER BY id DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      success: true,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: rows.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get single student with marks
exports.getStudentById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const studentRes = await db.query('SELECT * FROM students WHERE id=$1', [id]);
    if (studentRes.rowCount === 0) return res.status(404).json({ success: false, message: 'Not found' });
    const student = studentRes.rows[0];

    const marksRes = await db.query('SELECT id, subject, marks, term FROM marks WHERE student_id=$1', [id]);
    student.marks = marksRes.rows;

    res.json({ success: true, student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { first_name, last_name, email, dob } = req.body;
    console.log(dob);
    const updateQ = `
      UPDATE students SET first_name=$1, last_name=$2, email=$3, dob=$4, updated_at=now()
      WHERE id=$5 RETURNING *
    `;
    const result = await db.query(updateQ, [first_name, last_name, email, dob, id]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Student not found' });

    res.json({ success: true, student: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete student (cascade deletes marks due to FK)
exports.deleteStudent = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await db.query('DELETE FROM students WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ success:false, message: 'Student not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, error: err.message });
  }
};
