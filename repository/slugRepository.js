const pool = require('../config/db');
const bcrypt = require('bcrypt');  // <- Not used here, you can remove this import

class slugRepository {
    async getSlugs(id) {
        try {
            const result = await pool.query(
                "SELECT p.name, p.slug FROM pages p JOIN user_page_access u ON u.page_id=p.id WHERE u.user_id=$1 and u.is_enabled='true'",
                [id]
            );
            return result.rows;
        } catch (error) {
            console.log(error);
            // Consider throwing the error to be handled upstream
            throw error;
        }
    }
}

module.exports = new slugRepository();
