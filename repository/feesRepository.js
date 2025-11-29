const pool = require("../config/db");
class FeesRepository {
  async fetchAllFees() {
    try {
      const result = await pool.query(`SELECT 
    sf.id,
    sf.student_id,
    u.full_name,
    u.email,
    s.roll_no,
    s.address,
    sf.discount,
    sf.due_date,
    sf.total_fee AS total_fees,

    COALESCE(SUM(fp.amount_paid), 0) AS paid_amount,

    (
        sf.total_fee
        - (sf.total_fee * sf.discount / 100)
        - COALESCE(SUM(fp.amount_paid), 0)
    ) AS due_amount

FROM student_fees sf
JOIN students s ON sf.student_id = s.id
JOIN users u ON s.user_id = u.id

LEFT JOIN fee_payments fp 
       ON fp.student_fee_id = sf.id   -- correct link

GROUP BY 
    sf.id,
    sf.student_id,
    u.full_name,
    u.email,
    sf.discount,
    sf.due_date,
    s.roll_no,
    s.address,
    sf.total_fee;
`);

      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async collectFee(
    studentId,
    studentFeeId,
    amountPaid,
    method,
    status,
    receipt_number,
    transactionId
  ) {
    try {
      const result = await pool.query(
        `INSERT INTO fee_payments(
         student_id,
         student_fee_id,
         amount_paid,
         payment_method,
         status,
         receipt_number,
         transaction_id
       ) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          studentId,
          studentFeeId,
          amountPaid,
          method,
          status,
          receipt_number,
          transactionId,
        ]
      );

      return result.rowCount > 0 ? 1 : 0;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getDueAmountByStudentId(studentId) {
    try {
      const result = await pool.query(
        `SELECT 
          sf.total_fee 
          - (sf.total_fee * sf.discount / 100)
          - COALESCE(SUM(fp.amount_paid), 0) AS due_amount
       FROM student_fees sf
       LEFT JOIN orders o 
          ON o.student_fee_id = sf.id
       LEFT JOIN fee_payments fp 
          ON fp.student_fee_id = sf.id 
          OR fp.order_id = o.id
       WHERE sf.student_id = $1
       GROUP BY sf.total_fee, sf.discount`,
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
        `SELECT 
          f.amount_paid,
          f.payment_date,
          f.payment_method,
          f.status,
          f.receipt_number,
          f.transaction_id,
          s.roll_no,
          s.address,
          u.full_name
       FROM fee_payments f
       LEFT JOIN orders o 
          ON f.order_id = o.id
       LEFT JOIN students s 
          ON s.id = COALESCE(o.student_id, f.student_id)
       LEFT JOIN users u
          ON u.id = s.user_id
       WHERE COALESCE(o.student_id, f.student_id) = $1
       ORDER BY f.payment_date DESC`,
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
  fp.student_fee_id,
  u.full_name,
  s.roll_no,
  sf.due_date,
  u.email,COALESCE(SUM(fp.amount_paid),0) AS paid_amount,
  sf.total_fee AS total_fees,sf.discount,
  sf.total_fee - COALESCE(SUM(fp.amount_paid),0) - (sf.total_fee *sf.discount/100) AS due_amount
FROM fee_payments fp
JOIN students s ON s.id=fp.student_id
JOIN users u ON s.user_Id=u.id
JOIN student_fees sf ON sf.id=fp.student_fee_id
WHERE s.id=$1
  GROUP BY fp.student_fee_id,u.full_name,s.roll_no,u.email,sf.total_fee,sf.discount,sf.due_date`,
        [userId]
      );

      return query.rowCount > 0 ? query.rows[0] : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async payFees(
    orderId,
    razorpayPaymentId,
    razorpaySignature,
    amountPaid,
    paymentMethod,
    status,
    receiptNumber,
    transactionId,
    feeId,
    studentId
  ) {
    try {
      const query = await pool.query(
        `INSERT INTO fee_payments(
        order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount_paid,
        payment_method,
        status,
        receipt_number,
        transaction_id,
        student_fee_id,
        student_id
      )
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          orderId,
          razorpayPaymentId,
          razorpaySignature,
          amountPaid,
          paymentMethod,
          status,
          receiptNumber,
          transactionId,
          feeId,
          studentId,
        ]
      );

      return query.rowCount > 0 ? 1 : 0;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}

module.exports = new FeesRepository();
