const pool = require("../config/db");
const middleware = require("../middleware/auth");

class AttendanceRepository {
  async addDailyAttendance(classId, date, sessionId, sectionId, teacherId) {
    let attendanceId;
    const query_teacher_id = await pool.query(
      "SELECT id FROM teachers WHERE user_id=$1",
      [teacherId]
    );
    const teacher_Id =
      query_teacher_id.rows.length > 0
        ? query_teacher_id.rows[0].id
        : teacherId;
    try {
      const query = await pool.query(
        "SELECT id from daily_attendance WHERE class_id=$1 AND attendance_date=$2 AND session_id=$3",
        [classId, date, sessionId]
      );
      if (query.rowCount > 0) {
        attendanceId = query.rows[0].id;

        const query2 = await pool.query(
          `SELECT u.full_name, e.class_id, s.id,s.roll_no,dar.status
	          FROM enrollments e
          JOIN students s
	          ON s.id = e.student_id
          LEFT JOIN users u 
	          ON u.id = s.user_id
          LEFT JOIN daily_attendance_records dar 
            ON dar.student_id = s.id AND dar.attendance_id = $3
          WHERE e.class_id = $1 
            AND e.session_id = $2; `,
          [classId, sessionId, attendanceId]
        );
        return { student: query2.rows, attendanceId: attendanceId };
      } else {
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
          const query = await client.query(
            "INSERT INTO daily_attendance (class_id,teacher_id,attendance_date,session_id) VALUES($1,$2,$3,$4) RETURNING id",
            [classId, teacher_Id, date, sessionId]
          );
          attendanceId = query.rows[0].id;
          const query2 = await client.query(
            `SELECT 
            u.full_name,
            s.class_id,
            s.id,
            s.roll_no,
            dar.status
          FROM students s
          LEFT JOIN users u ON u.id = s.user_id
          LEFT JOIN daily_attendance_records dar 
            ON dar.student_id = s.id AND dar.attendance_id = $3
          WHERE s.class_id = $1 AND s.session_id = $2`,
            [classId, sessionId, attendanceId]
          );
          await client.query("COMMIT");
          return query2.rows;
        } catch (error) {
          await client.query("ROLLBACK");
          console.error("Transaction failed:", error);
          return null;
        } finally {
          client.release();
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async storeAttendance(attendanceData, teacherId) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (const std of attendanceData.student) {
        await client.query(
          `INSERT INTO daily_attendance_records 
            (attendance_id, student_id, status, remarks, marked_by)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (attendance_id, student_id)
            DO UPDATE SET
              status = EXCLUDED.status,
              remarks = EXCLUDED.remarks,
              marked_by = EXCLUDED.marked_by`,
          [attendanceData.id, std.id, std.status, std.remarks, teacherId]
        );
      }
      await client.query("COMMIT");

      return { success: true, message: "Attendance recorded successfully" };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error while storing attendance:", error);
      return { success: false, message: "Failed to store attendance", error };
    } finally {
      client.release();
    }
  }

  async viewStudent(classId, sessionId) {
    try {
      const query = await pool.query(
        `SELECT s.id,u.full_name,s.roll_no
	        FROM enrollments e
        JOIN students s
	        ON s.id = e.student_id
        JOIN users u 
	        ON u.id = s.user_id
        JOIN classes c 
	        ON e.class_id = c.id
        WHERE e.class_id = $1 AND e.session_id = $2;`,
        [classId, sessionId]
      );
      return query.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async viewAttendance(studentId) {
    try {
      const result = await pool.query(
        `SELECT dar.student_id,dar.status,da.attendance_date from daily_attendance_records dar
          JOIN daily_attendance da 
          ON dar.attendance_id=da.id
          WHERE dar.student_id=$1`,
        [studentId]
      );
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAttendanceByClass(studentId, classId) {
    try {
      const result = await pool.query(
        `SELECT dar.student_id,dar.status,da.attendance_date from daily_attendance_records dar
          JOIN daily_attendance da 
          ON dar.attendance_id=da.id
          WHERE dar.student_id=$1 AND da.class_id=$2`,
        [studentId, classId]
      );
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getEnrolledClass(studentId) {
    try {
      const query = await pool.query(
        `SELECT c.id,c.name FROM enrollments e
          JOIN classes c
          ON e.class_id=c.id
          WHERE e.student_id=$1`,
        [studentId]
      );
      return query.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAttendanceByStudent(id) {
    try {
      const query = await pool.query(
        `SELECT dar.id,dar.status,dar.remarks,da.attendance_date FROM daily_attendance_records dar
          LEFT JOIN daily_attendance da
          ON da.id=dar.attendance_id
          WHERE dar.student_id=$1`,
        [id]
      );
      return query.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getStudentIdFromUserId(id) {
    try {
      const query = await pool.query(
        `SELECT s.id FROM students s
          JOIN users u 
          ON u.id=s.user_id
          WHERE u.id=$1`,
        [id]
      );
      return query.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = new AttendanceRepository();
