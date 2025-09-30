const FeesRepository = require('../repository/feesRepository');

async function fetchAllFees(req, res) {
    const result = await FeesRepository.fetchAllFees();
    if (!result) {
        return res.status(500).json({ message: "There is something wrong" });
    }
    res.status(200).json({ data: result });
}

module.exports = { fetchAllFees }