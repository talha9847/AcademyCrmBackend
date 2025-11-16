const pool = require("../config/db");
class FeesRepository {
  async fetchAllFees() {
    try {
      const result =
        await pool.query(`SELECT sf.id, sf.student_id, u.full_name,u.email,sf.due_date,sf.total_fee AS total_fees,COALESCE (SUM(fp.amount_paid) ,0) AS paid_amount, (sf.total_fee - COALESCE (SUM(fp.amount_paid),0)) AS due_amount
                FROM student_fees sf
                LEFT JOIN students s ON sf.student_id = s.id
                JOIN users u ON s.user_id = u.id
                LEFT JOIN fee_payments fp ON fp.student_fee_id = sf.id
                GROUP BY sf.id, u.full_name,u.email,sf.due_date,sf.total_fee;`);

      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async collectFee(
    studentId,
    feeId,
    amountPaid,
    method,
    status,
    receipt_number
  ) {
    try {
      const result = await pool.query(
        "INSERT INTO fee_payments(student_id, student_fee_id, amount_paid, payment_method, status,receipt_number) VALUES ($1, $2, $3, $4, $5,$6)",
        [studentId, feeId, amountPaid, method, status, receipt_number]
      );
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getDueAmountByStudentId(studentId) {
    try {
      const result = await pool.query(
        `SELECT sf.total_fee-COALESCE(SUM(fp.amount_paid),0) AS due_amount FROM student_fees sf
                                                LEFT JOIN fee_payments fp 
                                                ON sf.id=fp.student_fee_id
                                                WHERE sf.student_id=$1
                                                group by fp.student_id,sf.total_fee`,
        [studentId]
      );

      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getFeePaymentsById(studentId) {
    try {
      const result = await pool.query(
        "SELECT amount_paid,payment_date,payment_method,status,receipt_number FROM fee_payments WHERE student_id=$1",
        [studentId]
      );
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = new FeesRepository();
