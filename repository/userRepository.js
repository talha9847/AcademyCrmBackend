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
    const result = await pool.query(
      "SELECT u.id,u.full_name,u.email,s.gender,c.name FROM users u JOIN students s ON u.id=s.user_id LEFT JOIN classes c ON s.class_id=c.id WHERE role='student' ORDER BY u.created_at ASC"
    );
    return result.rows;
  }

  async CreateStudent(
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
    p_photo,
    s_photo,
    enrollments,
    mobile
  ) {
    enrollments = JSON.parse(enrollments);

    const client = await pool.connect();

    try {
      const checkResult = await pool.query(
        "SELECT 1 FROM users WHERE email = $1",
        [email]
      );

      if (checkResult.rowCount > 0) {
        return { success: false, message: "Email already exists" };
      }

      await client.query("BEGIN");
      let password = await bcrypt.hash("Student@123", 10);
      const result = await client.query(
        "INSERT INTO users(full_name,email,role,password) VALUES ($1,$2,$3,$4) RETURNING *",
        [fullName, email, "student", password]
      );
      let userId = result.rows[0].id;
      const student = await client.query(
        "INSERT INTO students (user_id,class_id,section_id,admission_number,date_of_birth,gender,roll_no,session_id,address,profile_photo,signature_photo,mobile) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",
        [
          userId,
          classId,
          sectionId,
          admissionNumber,
          dob,
          gender,
          rollNo,
          sessionId,
          address,
          p_photo,
          s_photo,
          mobile,
        ]
      );
      let studentId = student.rows[0].id;
      await client.query(
        "INSERT INTO student_fees(student_id,total_fee,due_date,discount,description) VALUES($1,$2,$3,$4,$5) RETURNING *",
        [studentId, totalFee, dueDate, discount, description]
      );
      for (const en of enrollments) {
        await client.query(
          "INSERT INTO enrollments(student_id,class_id,session_id) VALUES($1,$2,$3)",
          [studentId, en.classId, en.sessionId]
        );
      }
      await client.query(
        "INSERT INTO parents(student_id,full_name,phone,email,relation,occupation,address) VALUES($1,$2,$3,$4,$5,$6,$7)",
        [
          studentId,
          p_name,
          p_phone,
          p_email,
          p_relation,
          p_occupation,
          p_address,
        ]
      );
      await client.query(
        "INSERT INTO user_page_access(user_id,page_id,is_enabled) SELECT $1,p.id, FALSE FROM pages p",
        [userId]
      );
      await client.query("COMMIT");
      return { success: true, data: { fullName, email } };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Transaction failed:", error);
      return { success: false, message: "Database transaction failed" };
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
         u.is_active,
         s.gender,
         s.mobile,
         s.admission_number,
         s.date_of_birth,
         s.roll_no,
         s.address AS student_address,
         s.profile_photo,
         s.signature_photo,
         s.status,
         sf.total_fee,
         c.name AS class_name,
         c.id AS class_id,
         ss.id AS session_id,
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
       JOIN student_fees sf ON sf.student_id=s.id
       WHERE u.id = $1
       ORDER BY u.created_at ASC
       LIMIT 1`,
        [id]
      );

      const enrolledClasses = await pool.query(
        `SELECT e.id,cs.id AS class_id,cs.name,ss.timing,ss.id AS session_id from enrollments e
	        JOIN students s ON s.id=e.student_id
	        JOIN users u ON u.id=s.user_id
	        JOIN classes cs ON e.class_id=cs.id
          JOIN sessions ss ON e.session_id=ss.id
	        WHERE s.user_id=$1`,
        [id]
      );
      return {
        student: result.rows[0],
        enrolledClasses: enrolledClasses.rows,
      };
    } catch (error) {
      console.error("Error fetching student by ID:", error);
      throw error;
    }
  }

  async CreateTeacher(fullName, email, hireDate, department, gender) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      let password = await bcrypt.hash("Teacher@123", 10);
      const result = await client.query(
        "INSERT INTO users(full_name,email,role,password) VALUES ($1,$2,$3,$4) RETURNING *",
        [fullName, email, "teacher", password]
      );
      let userId = result.rows[0].id;
      await client.query(
        "INSERT INTO teachers(user_id,hire_date,department,gender) VALUES ($1,$2,$3,$4) RETURNING *",
        [userId, hireDate, department, gender]
      );
      await client.query(
        "INSERT INTO user_page_access(user_id,page_id,is_enabled) SELECT $1,p.id, FALSE FROM pages p",
        [userId]
      );
      await client.query("COMMIT");
      return { userId, department, fullName };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Transaction failed:", error);
      return null;
    } finally {
      client.release();
    }
  }

  async getAllTeachers() {
    try {
      const result =
        await pool.query(`SELECT u.id,u.email,u.full_name,t.department,t.gender FROM USERS u
              LEFT JOIN teachers t 
              ON t.user_id=u.id
              WHERE u.role='teacher'`);
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(email, password) {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) {
      return null;
    }
    if (user.is_active == false) {
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
