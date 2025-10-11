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
    const { studentId, feeId, amountPaid, method, status } = req.body;
    if (studentId === "" || isNaN(studentId)) {
        return res.status(400).json({ success: false, message: "Student Id is missing or invalid" });
    }

    if (feeId === "" || isNaN(feeId)) {
        return res.status(400).json({ success: false, message: "Fee Id is missing or invalid" });
    }

    if (amountPaid === "" || isNaN(amountPaid)) {
        return res.status(400).json({ success: false, message: "Amount is missing or invalid" });
    }

    const dueAmount = await feesRepository.getDueAmountByStudentId(studentId);

    if (Number(amountPaid) > Number(dueAmount.due_amount)) {
        return res.status(400).json({ success: false, message: "Amount can't be greater than the due amount" });
    }


    const result = await feesRepository.collectFee(studentId, feeId, amountPaid, method, status);
    if (!result) {
        return res.status(500).json({ success: false, message: "There is something wrong" })
    }
    return res.status(200).json({ success: true, message: "Collected successfully" });
}


async function getFeePaymentsById(req, res) {
    const { studentId } = req.body;
    const result = await feesRepository.getFeePaymentsById(studentId);
    if (!result) {
        return res.status(500).json({ message: "There is some error occured", success: false })
    }
    return res.status(200).json({ success: true, data: result })
}

module.exports = { fetchAllFees, collectFee, getFeePaymentsById }