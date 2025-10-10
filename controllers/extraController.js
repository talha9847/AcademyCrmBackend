const extraRepository = require('../repository/extraRepository');

async function getAllClasses(req, res) {
    const result = await extraRepository.getAllClasses();
    if (!result) {
        return res.status(500).json({ message: "There is something missing" });
    }
    return res.status(200).json({ data: result });
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
    return res.status(200).json({ data: result })
}

module.exports = { getAllClasses, getAllSessions, getAllSections, getSectionById }