const slugRepository = require('../repository/slugRepository');
const { foundClaims } = require('../middleware/auth')

async function getSlugs(req, res) {
    const user = foundClaims(req);
    if (!user.id) {
        return res.status(401).json({ message: "You are not authorized" });
    }
    const result = await slugRepository.getSlugs(user.id);
    return res.status(200).json({ message: "Loaded successfully", data: result });
}

module.exports = { getSlugs };