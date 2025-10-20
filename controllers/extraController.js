const extraRepository = require("../repository/extraRepository");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

async function getAllClasses(req, res) {
  const result = await extraRepository.getAllClasses();
  if (!result) {
    return res.status(500).json({ message: "There is something missing" });
  }
  return res.status(200).json({ data: result });
}

async function updateClass(req, res) {
  const { id, name } = req.body;

  const result = await extraRepository.updateClass(id, name);
  if (result <= 0) {
    return res
      .status(500)
      .json({ success: false, message: "There is some error occured" });
  }
  return res.status(200).json({ success: true });
}
async function addClass(req, res) {
  const { name } = req.body;

  const result = await extraRepository.addClass(name);
  if (result <= 0) {
    return res
      .status(500)
      .json({ success: false, message: "There is some error occured" });
  }
  return res.status(200).json({ success: true });
}
async function addSession(req, res) {
  const { timing } = req.body;

  const result = await extraRepository.addSession(timing);
  if (result <= 0) {
    return res
      .status(500)
      .json({ success: false, message: "There is some error occured" });
  }
  return res.status(200).json({ success: true });
}
async function updateSessions(req, res) {
  const { id, timing } = req.body;

  const result = await extraRepository.updateSessions(id, timing);
  if (result <= 0) {
    return res
      .status(500)
      .json({ success: false, message: "There is some error occured" });
  }
  return res.status(200).json({ success: true });
}

async function getAllSessions(req, res) {
  const result = await extraRepository.getAllSessions();
  if (!result) {
    return res.status(500).json({ message: "There is something missing" });
  }
  return res.status(200).json({ data: result });
}
async function getAllSections(req, res) {
  const result = await extraRepository.getAllSections();
  if (!result) {
    return res.status(500).json({ message: "There is something missing" });
  }
  return res.status(200).json({ data: result });
}
async function getSectionById(req, res) {
  const id = req.query.id;
  const result = await extraRepository.getSectionById(id);
  if (!result) {
    return res.status(500).json({ message: "There is some erorr occured" });
  }
  return res.status(200).json({ data: result });
}

async function generateCertificate(name) {
  const templatePath = path.resolve(__dirname, "../public/cetificate.png");
  console.log(templatePath + "this is talha");

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
};
