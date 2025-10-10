const feesRepository = require('../repository/feesRepository');
const FeesRepository = require('../repository/feesRepository');

async function fetchAllFees(req, res) {
    const result = await FeesRepository.fetchAllFees();
    if (!result) {
        return res.status(500).json({ message: "There is something wrong" });
    }
    res.status(200).json({ data: result });
}

async function collectFee(req, res) {
    console.log("i am clicked")
    const { studentId, feeId, amountPaid, method, status } = req.body;
    const result = await feesRepository.collectFee(studentId, feeId, amountPaid, method, status);
    if (!result) {
        return res.status(500).json({ success: false, message: "There is something wrong" })
    }
    return res.status(200).json({ success: true, message: "Collected successfully" });
}

module.exports = { fetchAllFees, collectFee }