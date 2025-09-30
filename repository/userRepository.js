const pool = require("../config/db");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

class UserRepository {
  async CreateUser(email, password, fullName, role) {
    const result = await pool.query(
      "INSERT INTO users(email,password,full_name,role) VALUES($1,$2,$3,$4) RETURNING *",
      [email, password, fullName, role]
    );
    return result.rows[0];
  }

  async FindByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    return result.rows[0];
  }


  async GetAllStudents() {
    const result = await pool.query("SELECT u.id,u.full_name,u.email,s.gender,c.name FROM users u JOIN students s ON u.id=s.user_id LEFT JOIN classes c ON s.class_id=c.id WHERE role='student' ORDER BY u.created_at ASC");
    return result.rows;
  }

  async CreateStudent(fullName, email, classId, sectionId, admissionNumber, dob, gender, rollNo, sessionId, address, totalFee, dueDate, discount, description, p_name, p_phone, p_email, p_relation, p_occupation, p_address) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      let password = await bcrypt.hash('Student@123', 10);
      const result = await client.query("INSERT INTO users(full_name,email,role,password) VALUES ($1,$2,$3,$4) RETURNING *", [fullName, email, 'student', password]);
      let userId = result.rows[0].id;
      const student = await client.query('INSERT INTO students (user_id,class_id,section_id,admission_number,date_of_birth,gender,roll_no,session_id,address) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *', [userId, classId, sectionId, admissionNumber, dob, gender, rollNo, sessionId, address])
      let studentId = student.rows[0].id;
      await client.query("INSERT INTO student_fees(student_id,total_fee,due_date,discount,description) VALUES($1,$2,$3,$4,$5) RETURNING *", [studentId, totalFee, dueDate, discount, description]);
      await client.query("INSERT INTO parents(student_id,full_name,phone,email,relation,occupation,address) VALUES($1,$2,$3,$4,$5,$6,$7)", [studentId, p_name, p_phone, p_email, p_relation, p_occupation, p_address])
      await client.query('COMMIT');
      return { fullName, email }
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Transaction failed:", error);
      return null;
    } finally {
      client.release();
    }
  }

  async getStudentById(id) {
    try {
      const result = await pool.query(
        `SELECT 
         u.id AS user_id,
         u.full_name AS student_name,
         u.email AS student_email,
         s.gender,
         s.admission_number,
         s.date_of_birth,
         s.roll_no,
         s.address AS student_address,
         c.name AS class_name,
         sc.name AS section_name,
         ss.timing AS session_timing,
         p.full_name AS parent_name,
         p.phone AS parent_phone,
         p.email AS parent_email,
         p.relation AS parent_relation,
         p.occupation AS parent_occupation,
         p.address AS parent_address
       FROM users u
       JOIN students s ON u.id = s.user_id
       LEFT JOIN classes c ON s.class_id = c.id
       LEFT JOIN sections sc ON s.section_id = sc.id
       LEFT JOIN sessions ss ON s.session_id = ss.id
       LEFT JOIN parents p ON p.student_id = s.id
       WHERE u.id = $1
       ORDER BY u.created_at ASC
       LIMIT 1`,
        [id]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching student by ID:', error);
      throw error;
    }
  }


  async CreateTeacher(fullName, email, hireDate, department) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      let password = await bcrypt.hash('Teacher@123', 10);
      const result = await client.query("INSERT INTO users(full_name,email,role,password) VALUES ($1,$2,$3,$4) RETURNING *", [fullName, email, 'teacher', password]);
      let userId = result.rows[0].id;
      await client.query('INSERT INTO teachers(user_id,hire_date,department) VALUES ($1,$2,$3) RETURNING *', [userId, hireDate, department]);
      await client.query('COMMIT');
      return { userId, department, fullName };
    } catch (error) {
      await client.query('ROLLBACK')
      console.error("Transaction failed:", error);
      return null;
    } finally {
      client.release();
    }
  }

  async getAllTeachers() {
    try {
      const result = await pool.query(`SELECT u.id,u.email,u.full_name,t.department,t.gender FROM USERS u
              LEFT JOIN teachers t 
              ON t.user_id=u.id
              WHERE u.role='teacher'`)
      return result.rows;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  async login(email, password) {

    const result = pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = (await result).rows[0];
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    };
  }
}

module.exports = new UserRepository();
