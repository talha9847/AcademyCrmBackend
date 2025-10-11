const frontWebsiteRepository = require('../repository/frontWebsiteRepository')

async function getCourses(req, res) {
    const result = await frontWebsiteRepository.getCourses();
    if (!result) {
        return res.status(500).json({ message: "There is some error", success: false });
    }
    return res.status(200).json({ success: true, data: result })
}

module.exports = { getCourses }