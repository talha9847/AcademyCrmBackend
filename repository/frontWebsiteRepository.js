const pool = require('../config/db')

class frontWebsite {
    async getCourses() {
        try {
            const result = await pool.query(`
                                SELECT id, category, title, description, price, duration, level, image
                                FROM courses
                                WHERE featured = true
                                LIMIT 4
                                        `);
            return result.rows;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
}

module.exports = new frontWebsite();