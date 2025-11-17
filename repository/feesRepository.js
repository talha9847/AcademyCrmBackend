const pool = require("../config/db");
class FeesRepository {
  async fetchAllFees() {
    try {
      const result = await pool.query(`SELECT 
    sf.id, 
    sf.student_id, 
    u.full_name,
    u.email,
    sf.discount,
    sf.due_date,
    sf.total_fee AS total_fees,
    COALESCE(SUM(fp.amount_paid), 0) AS paid_amount,
    (sf.total_fee 
        - sf.total_fee * sf.discount / 100 
        - COALESCE(SUM(fp.amount_paid), 0)
    ) AS due_amount
FROM student_fees sf
LEFT JOIN students s ON sf.student_id = s.id
JOIN users u ON s.user_id = u.id
LEFT JOIN fee_payments fp ON fp.student_fee_id = sf.id
GROUP BY 
    sf.id, 
    sf.student_id,
    u.full_name, 
    u.email, 
    sf.discount,
    sf.due_date, 
    sf.total_fee;`);

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
    receipt_number,
    transactionId
  ) {
    try {
      const result = await pool.query(
        "INSERT INTO fee_payments(student_id, student_fee_id, amount_paid, payment_method, status,receipt_number,transaction_id) VALUES ($1, $2, $3, $4, $5,$6,$7)",
        [
          studentId,
          feeId,
          amountPaid,
          method,
          status,
          receipt_number,
          transactionId,
        ]
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
        "SELECT amount_paid,payment_date,payment_method,status,receipt_number,transaction_id FROM fee_payments WHERE student_id=$1",
        [studentId]
      );
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async fetchFeesByStudent(userId) {
    try {
      const query = await pool.query(
        `SELECT 
          sf.id, 
          u.full_name,
          s.roll_no,
          u.email,
          sf.discount,
          sf.due_date,
          sf.total_fee AS total_fees,
          COALESCE(SUM(fp.amount_paid), 0) AS paid_amount,
          (sf.total_fee 
              - sf.total_fee * sf.discount / 100 
              - COALESCE(SUM(fp.amount_paid), 0)
          ) AS due_amount
        FROM student_fees sf
        LEFT JOIN students s ON sf.student_id = s.id
        JOIN users u ON s.user_id = u.id
        LEFT JOIN fee_payments fp ON fp.student_fee_id = sf.id
        WHERE sf.student_id=$1
        GROUP BY 
            sf.id, 
            sf.student_id,
            u.full_name, 
            u.email, 
            s.roll_no,
            sf.discount,
            sf.due_date, 
            sf.total_fee;`,
        [userId]
      );
      if (query.rowCount > 0) {
        return query.rows[0];
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async payFees(
    studentId,
    feeId,
    amountPaid,
    paymentMethod,
    status,
    receiptNumber,
    transactionId
  ) {
    try {
      const query = await pool.query(
        "INSERT INTO fee_payments(student_id,student_fee_id,amount_paid,payment_method,status,receipt_number,transaction_id)VALUES($1,$2,$3,$4,$5,$6,$7)",
        [
          studentId,
          feeId,
          amountPaid,
          paymentMethod,
          status,
          receiptNumber,
          transactionId,
        ]
      );
      if (query.rowCount < 1) {
        return 0;
      }
      return 1;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}

module.exports = new FeesRepository();
