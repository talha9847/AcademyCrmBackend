const pool = require("../config/db");

class frontWebsite {
  async getHeroSectionData() {
    try {
      const result =
        await pool.query(`SELECT id,badge_text,heading1,heading2,description,stat1_value,stat2_value,stat3_value,
		                                        floating_card1_title,floating_card1_subtitle,floating_card2_title,floating_card2_subtitle
                                            FROM HEROSECTION`);
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAboutPageSection() {
    try {
      const result = await pool.query(
        "SELECT id,heading1,description1,heading2,description2,description3,state_val,heading3,description4 FROM aboutpagesection"
      );
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async aboutCoreVision() {
    try {
      const result = await pool.query(
        "SELECT id,icon,title,description,color FROM aboutCoreVision WHERE show=true LIMIT 4"
      );
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getAllAboutCoreVision() {
    try {
      const result = await pool.query(
        "SELECT id,icon,title,description,color,show FROM aboutCoreVision"
      );
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async aboutCoreMission() {
    try {
      const result = await pool.query(
        "select id,icon,title,description from aboutCoreMission WHERE show=true LIMIT 4"
      );
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getAboutCoreMission() {
    try {
      const result = await pool.query(
        "select id,icon,title,description,show from aboutCoreMission"
      );
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async updateAboutCoreMission(icon, title, description, show, id) {
    try {
      const result = await pool.query(
        "UPDATE aboutCoreMission SET icon=$1,title=$2,description=$3,show=$4  WHERE id=$5",
        [icon, title, description, show, id]
      );

      return result.rowCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async addAboutCoreMission(icon, title, description, show) {
    try {
      const result = await pool.query(
        "INSERT INTO  aboutCoreMission(icon,title,description,show) VALUES ($1,$2,$3,$4)",
        [icon, title, description, show]
      );

      return result.rowCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateAboutSection(
    heading1,
    description1,
    heading2,
    description2,
    description3,
    state_val,
    heading3,
    description4,
    id
  ) {
    try {
      const query = await pool.query(
        `UPDATE aboutpagesection 
          SET 
          heading1=$1,description1=$2,heading2=$3,description2=$4,description3=$5,state_val=$6,heading3=$7,description4=$8
          WHERE 
          id=$9`,
        [
          heading1,
          description1,
          heading2,
          description2,
          description3,
          state_val,
          heading3,
          description4,
          id,
        ]
      );
      return query.rowCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateHeroData(
    badgeText,
    heading1,
    heading2,
    description,
    stat1Value,
    stat2Value,
    stat3Value,
    floatingCard1Title,
    floatingCard1Subtitle,
    floatingCard2Title,
    floatingCard2Subtitle
  ) {
    try {
      const result = await pool.query(
        `UPDATE HEROSECTION
                                        SET 
                                            badge_text = $1,
                                            heading1 = $2,
                                            heading2 = $3,
                                            description = $4,
                                            stat1_value = $5,
                                            stat2_value = $6,
                                            stat3_value = $7,
                                            floating_card1_title = $8,
                                            floating_card1_subtitle = $9,
                                            floating_card2_title = $10,
                                            floating_card2_subtitle = $11
                                        WHERE id = 1
                                        RETURNING *;

                                    `,
        [
          badgeText,
          heading1,
          heading2,
          description,
          stat1Value,
          stat2Value,
          stat3Value,
          floatingCard1Title,
          floatingCard1Subtitle,
          floatingCard2Title,
          floatingCard2Subtitle,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

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
      console.log(error);
      throw error;
    }
  }

  async getAllCourses() {
    try {
      const result =
        await pool.query(` SELECT id, category, title, description, price, duration, level, image,featured
                                FROM courses  `);
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getTestimonials() {
    try {
      const result = await pool.query(
        "SELECT id, name,course,rating,text FROM testimonials WHERE show=true LIMIT 3"
      );
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getAllTestimonials() {
    try {
      const result = await pool.query(
        "SELECT id, name,course,rating,text,show FROM testimonials"
      );
      return result.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateTestimonials(name, course, rating, text, show, id) {
    try {
      const query = await pool.query(
        "UPDATE testimonials SET name=$1,course=$2,rating=$3,text=$4,show=$5 WHERE id=$6",
        [name, course, rating, text, show, id]
      );
      return query.rowCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addTestimonial(name, course, rating, text, show) {
    try {
      const query = await pool.query(
        "INSERT INTO testimonials (name,course,rating,text,show) VALUES($1,$2,$3,$4,$5)",
        [name, course, rating, text, show]
      );
      return query.rowCount;
    } catch (error) {
      console.log(error);
    }
  }

  async updateCourseById(
    category,
    title,
    description,
    price,
    duration,
    level,
    image,
    featured,
    id
  ) {
    try {
      const query = await pool.query(
        `UPDATE courses
             SET category=$1,
                 title=$2,
                 description=$3,
                 price=$4,
                 duration=$5,
                 level=$6,
                 image=$7,
                 featured=$8
             WHERE id=$9
             RETURNING *`,
        [
          category,
          title,
          description,
          price,
          duration,
          level,
          image,
          featured,
          id,
        ]
      );
      return query.rows[0];
    } catch (error) {
      console.error("Update failed:", error.message);
      throw error;
    }
  }

  async addCourse(
    category,
    title,
    description,
    price,
    duration,
    level,
    image,
    featured
  ) {
    try {
      const query = await pool.query(
        "INSERT INTO courses(category, title, description, price, duration, level, image,featured) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
        [category, title, description, price, duration, level, image, featured]
      );
      return query.rowCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async sendUsMessage(fname, lname, email, phone, course, message) {
    try {
      const query = await pool.query(
        "INSERT INTO SENDUSMESSAGE(fname,lname,email,phone,course,message) VALUES ($1,$2,$3,$4,$5,$6)",
        [fname, lname, email, phone, course, message]
      );
      return query.rowCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = new frontWebsite();
