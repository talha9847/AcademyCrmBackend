const pool = require("../config/db");
const frontWebsiteRepository = require("../repository/frontWebsiteRepository");

async function getHeroSectionData(req, res) {
  const result = await frontWebsiteRepository.getHeroSectionData();
  if (!result) {
    return res
      .status(500)
      .json({ message: "Some error occured", success: false });
  }
  return res.status(200).json({ success: true, data: result });
}

async function getAboutPageSection(req, res) {
  const result = await frontWebsiteRepository.getAboutPageSection();
  if (!result) {
    return res.status(500).json({ success: false, message: "There is no" });
  }

  return res.status(200).json({ success: false, data: result });
}
async function aboutCoreVision(req, res) {
  const result = await frontWebsiteRepository.aboutCoreVision();
  if (!result) {
    return res.status(500).json({ success: false, message: "There is no" });
  }

  return res.status(200).json({ success: false, data: result });
}
async function aboutCoreMission(req, res) {
  const result = await frontWebsiteRepository.aboutCoreMission();
  if (!result) {
    return res.status(500).json({ success: false, message: "There is no" });
  }

  return res.status(200).json({ success: false, data: result });
}
async function getAllAboutCoreVision(req, res) {
  const result = await frontWebsiteRepository.getAllAboutCoreVision();
  if (!result) {
    return res.status(500).json({ success: false, message: "There is no" });
  }

  return res.status(200).json({ success: false, data: result });
}

async function updateHeroData(req, res) {
  try {
    const {
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
    } = req.body;

    const result = await frontWebsiteRepository.updateHeroData(
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
    );

    if (!result) {
      return res
        .status(400)
        .json({ message: "Failed to update hero section." });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error in updateHeroData:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function getCourses(req, res) {
  const result = await frontWebsiteRepository.getCourses();
  if (!result) {
    return res
      .status(500)
      .json({ message: "There is some error", success: false });
  }
  return res.status(200).json({ success: true, data: result });
}

async function getAllCourses(req, res) {
  const result = await frontWebsiteRepository.getAllCourses();
  if (!result) {
    return res
      .status(500)
      .json({ message: "There is some error", success: false });
  }
  return res.status(200).json({ success: true, data: result });
}

async function getTestimonials(req, res) {
  const result = await frontWebsiteRepository.getTestimonials();
  if (!result) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ data: result, success: true });
}
async function getAllTestimonials(req, res) {
  const result = await frontWebsiteRepository.getAllTestimonials();
  if (!result) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ data: result, success: true });
}
async function updateTestimonials(req, res) {
  const { name, course, rating, text, show, id } = req.body;
  const result = await frontWebsiteRepository.updateTestimonials(
    name,
    course,
    rating,
    text,
    show,
    id
  );
  if (result < 1) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ messaeg: "this is good", success: true });
}

async function updateTestimonialToggle(req, res) {
  const { show, id } = req.body;
  try {
    const query = await pool.query(
      "UPDATE testimonials SET show=$1 WHERE id=$2",
      [show, id]
    );
    if (query.rowCount < 1) {
      return res
        .status(500)
        .json({ success: false, message: "there is some error" });
    }
    return res
      .status(200)
      .json({ success: true, message: "there is good one" });
  } catch (error) {}
}

async function deleteTestimonial(req, res) {
  const { id } = req.body;
  try {
    const query = await pool.query("DELETE FROM testimonials WHERE id=$1", [
      id,
    ]);
    if (query.rowCount < 1) {
      return res
        .status(500)
        .json({ success: false, message: "there is some error" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {}
}

async function updateCourseById(req, res) {
  const {
    category,
    title,
    description,
    price,
    duration,
    level,
    image,
    featured,
    id,
  } = req.body;
  const result = await frontWebsiteRepository.updateCourseById(
    category,
    title,
    description,
    price,
    duration,
    level,
    image,
    featured,
    id
  );
  if (!result) {
    return res
      .status(500)
      .json({ message: "Course Not found", success: false });
  }
  return res.status(200).json({ success: true });
}

async function addCourse(req, res) {
  const {
    category,
    title,
    description,
    price,
    duration,
    level,
    image,
    featured,
  } = req.body;
  console.log("iam bollena  " + featured);
  const result = await frontWebsiteRepository.addCourse(
    category,
    title,
    description,
    price,
    duration,
    level,
    image,
    featured
  );
  if (!result) {
    return res
      .status(500)
      .json({ message: "There is some error occured", success: false });
  }
  return res.status(200).json({ success: true });
}

async function sendUsMessage(req, res) {
  const { fname, lname, email, phone, course, message } = req.body;
  const result = await frontWebsiteRepository.sendUsMessage(
    fname,
    lname,
    email,
    phone,
    course,
    message
  );
  if (result < 1) {
    return res
      .status(500)
      .json({ message: "There is some error occurred", success: false });
  }
  return res.status(200).json({ success: true });
}

async function addTestimonial(req, res) {
  const { name, course, rating, text, show } = req.body;
  const result = await frontWebsiteRepository.addTestimonial(
    name,
    course,
    rating,
    text,
    show
  );
  if (result < 1) {
    return res
      .status(500)
      .json({ success: false, message: "there is no error" });
  }
  return res.status(200).json({ message: "good", success: true });
}
async function updateAboutSection(req, res) {
  try {
    const {
      heading1,
      description1,
      heading2,
      description2,
      description3,
      state_val,
      heading3,
      description4,
      id,
    } = req.body;
    const result = await frontWebsiteRepository.updateAboutSection(
      heading1,
      description1,
      heading2,
      description2,
      description3,
      state_val,
      heading3,
      description4,
      id
    );

    if (result < 1) {
      return res
        .status(500)
        .json({ message: "there is no error", success: false });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "there is no error", success: false });
  }
}

async function getAboutCoreMission(req, res) {
  const result = await frontWebsiteRepository.getAboutCoreMission();
  if (!result) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ data: result, success: true });
}

async function updateAboutCoreMission(req, res) {
  const { icon, title, description, show, id } = req.body;
  const result = await frontWebsiteRepository.updateAboutCoreMission(
    icon,
    title,
    description,
    show,
    id
  );
  if (result < 1) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ data: result, success: true });
}
async function updateAboutCoreVision(req, res) {
  const { icon, title, description, show, id } = req.body;
  const result = await frontWebsiteRepository.updateAboutCoreVision(
    icon,
    title,
    description,
    show,
    id
  );
  if (result < 1) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ data: result, success: true });
}

async function addAboutCoreMission(req, res) {
  const { icon, title, description, show } = req.body;
  const result = await frontWebsiteRepository.addAboutCoreMission(
    icon,
    title,
    description,
    show
  );
  if (result < 1) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ data: result, success: true });
}
async function addAboutCoreVision(req, res) {
  const { icon, title, description, show } = req.body;
  const result = await frontWebsiteRepository.addAboutCoreVision(
    icon,
    title,
    description,
    show
  );
  if (result < 1) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ data: result, success: true });
}

async function getMilestones(req, res) {
  const result = await frontWebsiteRepository.getMilestones();
  if (!result) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ data: result, success: true });
}
async function updateMilestone(req, res) {
  const { year, title, description, icon, color, id } = req.body;
  const result = frontWebsiteRepository.updateMilestone(
    year,
    title,
    description,
    icon,
    color,
    id
  );
  if (result < 1) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ data: result, success: true });
}
async function addMilestone(req, res) {
  const { year, title, description, icon, color } = req.body;
  const result = frontWebsiteRepository.addMilestone(
    year,
    title,
    description,
    icon,
    color
  );
  if (result < 1) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ data: result, success: true });
}
async function deleteMilestone(req, res) {
  const { id } = req.body;
  const result = await frontWebsiteRepository.deleteMilestone(id);
  if (result < 1) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ data: result, success: true });
}
async function getGallery(req, res) {
  const result = await frontWebsiteRepository.getGallery();
  if (!result) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ data: result, success: true });
}
async function getAllGallery(req, res) {
  const result = await frontWebsiteRepository.getAllGallery();
  if (!result) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ data: result, success: true });
}

async function getCoursDetailById(req, res) {
  const { courseId } = req.body;
  const result = await frontWebsiteRepository.getCoursDetailById(courseId);
  if (!result) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ data: result, success: true });
}

async function getBlogs(req, res) {
  const result = await frontWebsiteRepository.getBlogs();
  if (!result) {
    return res
      .status(500)
      .json({ success: false, message: "there is some error" });
  }
  return res.status(200).json({ data: result, success: true });
}
async function getAllBlogs(req, res) {
  try {
    const result = await frontWebsiteRepository.getAllBlogs();
    if (!result) {
      return res.status(500).json({
        success: false,
        message: "There is some error",
      });
    }

    const formattedBlogs = result.map((blog) => ({
      ...blog,
      date: new Date(blog.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    return res.status(200).json({ data: formattedBlogs, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function updateCourseModule(req, res) {
  const { module, courseId } = req.body;
  const modulesJSON = JSON.stringify(module);

  try {
    const query = await pool.query(
      "UPDATE courses SET curriculum = $1::jsonb WHERE id = $2",
      [modulesJSON, courseId]
    );
    if (query.rowCount < 1) {
      return res.status(500).json({ success: false });
    }
    return res
      .status(200)
      .json({ message: "It is good to see", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
}

async function updateCourseDescription(req, res) {
  const { long_description, courseId, short_description } = req.body;
  const modulesJSON = JSON.stringify(long_description);

  console.log(long_description, courseId, short_description);

  try {
    const query = await pool.query(
      "UPDATE courses SET long_description = $1::jsonb, short_description=$2 WHERE id = $3",
      [modulesJSON, short_description, courseId]
    );
    if (query.rowCount < 1) {
      return res.status(500).json({ success: false });
    }
    return res
      .status(200)
      .json({ message: "It is good to see", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
}

async function updateCourseInstructor(req, res) {
  const { title, courseId, name, des } = req.body;

  try {
    const query = await pool.query(
      "UPDATE courses SET instructor_title = $1, instructor_name=$2,instructor_bio=$3 WHERE id = $4",
      [title, name, des, courseId]
    );
    if (query.rowCount < 1) {
      return res.status(500).json({ success: false });
    }
    return res
      .status(200)
      .json({ message: "It is good to see", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false });
  }
}

async function deleteCourse(req, res) {
  const { id } = req.body;
  try {
    const query = await pool.query("DELETE FROM courses WHERE id=$1", [id]);
    if (query.rowCount < 1) {
      return res.status(500).json({ success: false });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    if (query.rowCount < 1) {
      return res.status(500).json({ success: false });
    }
  }
}

module.exports = {
  getCourses,
  getHeroSectionData,
  updateHeroData,
  getAllCourses,
  updateCourseById,
  addCourse,
  sendUsMessage,
  getAboutPageSection,
  aboutCoreVision,
  aboutCoreMission,
  getTestimonials,
  getAllTestimonials,
  updateTestimonials,
  updateTestimonialToggle,
  deleteTestimonial,
  addTestimonial,
  updateAboutSection,
  getAboutCoreMission,
  updateAboutCoreMission,
  addAboutCoreMission,
  getAllAboutCoreVision,
  updateAboutCoreVision,
  addAboutCoreVision,
  getMilestones,
  updateMilestone,
  addMilestone,
  deleteMilestone,
  getGallery,
  getAllGallery,
  getBlogs,
  getAllBlogs,
  getCoursDetailById,
  updateCourseModule,
  updateCourseDescription,
  updateCourseInstructor,
  deleteCourse,
};
