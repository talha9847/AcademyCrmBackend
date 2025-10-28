const pool = require("../config/db");
class studentRepository {
  async getProfileDetail(id) {
    try {
      const query = await pool.query(
        `SELECT 
            u.full_name,
	        u.email,
            c.name,
	        s.admission_number,
	        s.date_of_birth,
	        s.roll_no,
          s.profile_photo,
          s.signature_photo,
	        ss.timing,
	        s.gender,
            p.full_name,
	        p.phone,
	        p.email,
	        p.relation,
	        p.occupation,
	        p.address,
            ROUND(sf.total_fee, 2) AS total_fee,
            ROUND(sf.total_fee * sf.discount / 100, 2) AS discount,
            ROUND(sf.total_fee - sf.total_fee * sf.discount / 100, 2) AS payable
            FROM users u
            JOIN students s ON u.id = s.user_id
            JOIN classes c ON c.id = s.class_id
            JOIN parents p ON p.student_id=s.id
            JOIN sessions ss ON ss.id = s.session_id
            JOIN student_fees sf ON s.id = sf.student_id
            WHERE u.id = $1`,
        [id]
      );
      return query.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getStudentByClassAndSession(classId, sessionId) {
    try {
      const query = await pool.query(
        `SELECT s.id,u.full_name FROM
          students s
          JOIN users u
          ON u.id=s.user_id
          WHERE
          s.class_id=$1 AND s.session_id=$2`,
        [classId, sessionId]
      );
      return query.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getTemplatesByClass(classId) {
    try {
      const query = await pool.query(
        "SELECT id,name FROM templates WHERE class_id=$1",
        [classId]
      );
      return query.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = new studentRepository();
