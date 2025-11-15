const extraRepository = require("../repository/extraRepository");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");
const pool = require("../config/db");
const studentRepository = require("../repository/studentRepository");

async function getAllClasses(req, res) {
  try {
    const result = await extraRepository.getAllClasses();
    if (!result) {
      return res.status(500).json({ message: "There is something missing" });
    }
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ message: "There is something missing" });
  }
}

async function updateClass(req, res) {
  try {
    const { id, name } = req.body;

    const result = await extraRepository.updateClass(id, name);
    if (result <= 0) {
      return res
        .status(500)
        .json({ success: false, message: "There is some error occured" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "There is some error occured" });
  }
}
async function addClass(req, res) {
  try {
    const { name } = req.body;

    const result = await extraRepository.addClass(name);
    if (result <= 0) {
      return res
        .status(500)
        .json({ success: false, message: "There is some error occured" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "There is something missing" });
  }
}
async function addSession(req, res) {
  try {
    const { timing } = req.body;

    const result = await extraRepository.addSession(timing);
    if (result <= 0) {
      return res
        .status(500)
        .json({ success: false, message: "There is some error occured" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is something missing", success: false });
  }
}
async function updateSessions(req, res) {
  try {
    const { id, timing } = req.body;

    const result = await extraRepository.updateSessions(id, timing);
    if (result <= 0) {
      return res
        .status(500)
        .json({ success: false, message: "There is some error occured" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is something missing", success: false });
  }
}

async function getAllSessions(req, res) {
  try {
    const result = await extraRepository.getAllSessions();
    if (!result) {
      return res
        .status(500)
        .json({ message: "There is something missing", success: false });
    }
    return res.status(200).json({ data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is something missing", success: false });
  }
}
async function getAllSections(req, res) {
  try {
    const result = await extraRepository.getAllSections();
    if (!result) {
      return res
        .status(500)
        .json({ message: "There is something missing", success: false });
    }
    return res.status(200).json({ data: result, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is something missing", success: false });
  }
}
async function getSectionById(req, res) {
  try {
    const id = req.query.id;
    const result = await extraRepository.getSectionById(id);
    if (!result) {
      return res
        .status(500)
        .json({ message: "There is some erorr occured", success: false });
    }
    return res.status(200).json({ data: result, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is some erorr occured", success: false });
  }
}

async function generateCertificate(name) {
  try {
    const templatePath = path.resolve(__dirname, "../public/cetificate.png");

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found at: ${templatePath}`);
    }

    const outputFilename = `${Date.now()}.png`;
    const outputPath = path.resolve(
      __dirname,
      `../public/certificates/${outputFilename}`
    );

    const width = 2000;
    const height = 1414;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const template = await loadImage(templatePath);
    ctx.drawImage(template, 0, 0, width, height);

    ctx.font = "bold 64px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(name, width / 2, 700); // adjust Y if needed

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outputPath, buffer);

    return {
      localPath: outputPath,
      publicUrl: `/certificates/${outputFilename}`,
    };
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is some erorr occured", success: false });
  }
}

async function getTeachers(req, res) {
  try {
    const result = await extraRepository.getTeachers();
    if (!result) {
      return res
        .status(500)
        .json({ message: "this is not good", success: false });
    }

    return res.status(200).json({ message: "Ok", success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "this is not good", success: false });
  }
}
async function getStudents(req, res) {
  try {
    const result = await extraRepository.getStudents();
    if (!result) {
      return res
        .status(500)
        .json({ message: "this is not good", success: false });
    }

    return res.status(200).json({ message: "Ok", success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "this is not good", success: false });
  }
}
async function getSlugByUserId(req, res) {
  const { id } = req.body;
  try {
    const result = await extraRepository.getSlugByUserId(id);
    if (!result) {
      return res
        .status(500)
        .json({ message: "this is not good", success: false });
    }

    return res.status(200).json({ message: "Ok", success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "this is not good", success: false });
  }
}

async function toggleSlug(req, res) {
  const { id, value } = req.body;
  try {
    const result = await extraRepository.toggleSlug(id, value);
    if (result < 1) {
      return res.status(500).json({ message: "Error occured", success: false });
    }
    return res.status(200).json({ message: "Ok", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Error occured", success: false });
  }
}

module.exports = {
  getAllClasses,
  getAllSessions,
  getAllSections,
  getSectionById,
  generateCertificate,
  updateClass,
  addClass,
  updateSessions,
  addSession,
  getTeachers,
  getSlugByUserId,
  toggleSlug,
  getStudents,
};
