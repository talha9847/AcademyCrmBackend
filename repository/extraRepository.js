const pool = require("../config/db");

class ExtraRepository {
  async getAllClasses() {
    try {
      const result = await pool.query(
        "SELECT id, name FROM classes ORDER BY id"
      );
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateClass(id, name) {
    try {
      const query = await pool.query("UPDATE classes set name=$1 WHERE id=$2", [
        name,
        id,
      ]);
      return query.rowCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async addClass(name) {
    try {
      const query = await pool.query("INSERT INTO classes (name) VALUES($1)", [
        name,
      ]);
      return query.rowCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async addSession(timing) {
    try {
      const query = await pool.query(
        "INSERT INTO sessions (timing) VALUES($1)",
        [timing]
      );
      return query.rowCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateSessions(id, timing) {
    try {
      const query = await pool.query(
        "UPDATE sessions SET timing=$1 WHERE id=$2",
        [timing, id]
      );
      return query.rowCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getAllSessions() {
    try {
      const result = await pool.query(
        "SELECT id, timing FROM sessions ORDER BY id"
      );
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllSections() {
    try {
      const result = await pool.query(
        "SELECT c.id AS class_id, c.name AS class_name,s.id AS section_id,s.name AS section_name FROM classes c LEFT JOIN sections s ON c.id = s.class_id ORDER BY c.id, s.name;"
      );

      const tree = {};

      result.rows.forEach((row) => {
        if (!tree[row.class_id]) {
          tree[row.class_id] = {
            id: row.class_id,
            name: row.class_name,
            sections: [],
          };
        }

        if (row.section_id) {
          tree[row.class_id].sections.push({
            id: row.section_id,
            name: row.section_name,
          });
        }
      });

      return Object.values(tree);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getSectionById(id) {
    try {
      const result = await pool.query(
        "SELECT id,name FROM sections WHERE class_id=$1",
        [id]
      );
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = new ExtraRepository();
