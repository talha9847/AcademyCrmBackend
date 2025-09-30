const pool = require('../config/db')
class FeesRepository {
    async fetchAllFees() {
        try {
            const result = await pool.query(`SELECT sf.id,u.full_name,u.email,sf.due_date,sf.total_fee AS total_fees,SUM(fp.amount_paid) AS paid_amount,(sf.total_fee - SUM(fp.amount_paid)) AS due_amount
                FROM student_fees sf
                JOIN students s ON sf.student_id = s.id
                JOIN users u ON s.user_id = u.id
                JOIN fee_payments fp ON fp.student_fee_id = sf.id
                GROUP BY sf.id, u.full_name,u.email,sf.due_date,sf.total_fee;`)

            return result.rows;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
}

module.exports = new FeesRepository();