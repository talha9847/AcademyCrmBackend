const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middleware/auth");

class studentRepository {
  async getProfileDetail(id) {
    try {
      const query = await pool.query(
        `SELECT 
          u.full_name,
	        u.email,
          c.name,
          u.is_active,
	        s.admission_number,
	        s.date_of_birth,
	        s.roll_no,
          s.profile_photo,
          s.signature_photo,
          s.mobile,
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
        `SELECT 
          s.id AS student_id,
          u.full_name,
          e.class_id,
          e.session_id,
          e.section_id
          FROM enrollments e
          JOIN students s ON s.id = e.student_id
          JOIN users u ON u.id = s.user_id
          WHERE e.class_id = $1 
            AND e.session_id = $2;`,
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

  async assignCertificate(
    certificate_number,
    verification_code,
    recipient_id,
    title,
    description,
    issued_by,
    template_id
  ) {
    try {
      const getclassId = await pool.query(
        "SELECT class_id FROM templates WHERE id=$1",
        [template_id]
      );
      const classId = getclassId.rows[0].class_id;

      const getEnrollmentId = await pool.query(
        "SELECT id FROM enrollments WHERE student_id=$1 AND class_id=$2",
        [recipient_id, classId]
      );
      const enrollmentId = getEnrollmentId.rows[0].id;

      const query = await pool.query(
        `INSERT INTO certificates(certificate_number,verification_code,recipient_id,title,description,issued_by,template_id,enrollment_id)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          certificate_number,
          verification_code,
          recipient_id,
          title,
          description,
          issued_by,
          template_id,
          enrollmentId,
        ]
      );
      return query.rowCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllAssignedCertificates() {
    try {
      const query = await pool.query(
        `SELECT c.id,c.title,t.name as template,c.certificate_number,c.verification_code,c.issue_date,c.is_revoked,cs.name,s.profile_photo,s.signature_photo FROM certificates c
          JOIN students s 
          ON c.recipient_id=s.id
          JOIN classes cs
          ON cs.id=s.class_id
          JOIN templates t 
          ON c.template_id=t.id`
      );
      return query.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyCertificate(code) {
    try {
      const query = await pool.query(
        `SELECT c.title,s.profile_photo,s.date_of_birth,cs.name,c.issue_date,c.certificate_number,u.email,c.is_revoked
          FROM certificates c
          JOIN  students s
          ON c.recipient_id=s.id
          JOIN users u
          ON u.id=s.user_id
          JOIN classes cs
          ON cs.id=s.class_id
          WHERE c.verification_code=$1`,
        [code]
      );
      return query.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async alreadyAssigned(templateId, recipientId) {
    try {
      const result = await pool.query(
        `SELECT 1 
          FROM certificates
          WHERE template_id=$1 AND recipient_id=$2`,
        [templateId, recipientId]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCertificatesByStudent(userId) {
    try {
      const query = await pool.query(
        `SELECT c.title,c.certificate_number,c.verification_code,c.issue_date,t.name,cs.name as class_name,s.profile_photo,s.signature_photo
          FROM certificates c
          JOIN enrollments e ON e.id = c.enrollment_id
          JOIN classes cs ON cs.id = e.class_id
          JOIN templates t
          ON c.template_id=t.id
          JOIN students s
          ON s.id=c.recipient_id
          WHERE s.user_id = $1;`,
        [userId]
      );
      return query.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateStudentRollAndGender(rollNo, gender, studentId) {
    try {
      const query = await pool.query(
        "UPDATE students SET roll_no = $1, gender = $2 WHERE user_id = $3 RETURNING *",
        [rollNo, gender, studentId]
      );
      return query.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateEnrolledClasses(eId, classId, sessionId) {
    try {
      const query = await pool.query(
        `UPDATE enrollments SET class_id=$1,session_id=$2 WHERE id=$3 RETURNING *`,
        [classId, sessionId, eId]
      );
      return query.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addEnrolledClasses(classId, sessionId, studentId) {
    try {
      const query = await pool.query(
        `INSERT INTO enrollments(class_id,session_id,student_id) VALUES($1,$2,$3)`,
        [classId, sessionId, studentId]
      );

      return query.rowCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async deleteEnrolledClasses(id) {
    try {
      const query = await pool.query(`DELETE FROM enrollments WHERE id=$1`, [
        id,
      ]);
      return query.rowCount;
    } catch (error) {}
  }
  async updatePI(dob, address, status, contact, studentId) {
    try {
      const query = await pool.query(
        `UPDATE students SET status=$1,date_of_birth=$2,address=$3,mobile=$4 WHERE id=$5`,
        [status, dob, address, contact, studentId]
      );
      return query.rowCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async changePassword(newPass, id) {
    try {
      const query = await pool.query("SELECT password FROM users WHERE id=$1", [
        id,
      ]);
      const hased = await bcrypt.hash(newPass, 10);
      const check = await bcrypt.compare(newPass, query.rows[0].password);
      if (check) {
        return -1;
      } else {
        const query = await pool.query(
          "UPDATE users SET password=$1 WHERE id=$2",
          [hased, id]
        );
        if (query.rowCount < 1) {
          return 0;
        }
        return 1;
      }
    } catch (error) {
      console.log(error);
      return -2;
    }
  }
}

module.exports = new studentRepository();
