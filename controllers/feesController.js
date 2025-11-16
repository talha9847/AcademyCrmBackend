const pool = require("../config/db");
const feesRepository = require("../repository/feesRepository");
const FeesRepository = require("../repository/feesRepository");

async function fetchAllFees(req, res) {
  try {
    const result = await FeesRepository.fetchAllFees();
    if (!result) {
      return res
        .status(500)
        .json({ message: "There is something wrong", success: false });
    }
    res.status(200).json({ data: result, success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is something wrong", success: false });
  }
}

async function collectFee(req, res) {
  try {
    let receipt_number = "";
    const { studentId, feeId, amountPaid, method, status } = req.body;
    if (studentId === "" || isNaN(studentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Student Id is missing or invalid" });
    }

    if (feeId === "" || isNaN(feeId)) {
      return res
        .status(400)
        .json({ success: false, message: "Fee Id is missing or invalid" });
    }

    if (amountPaid === "" || isNaN(amountPaid)) {
      return res
        .status(400)
        .json({ success: false, message: "Amount is missing or invalid" });
    }

    const dueAmount = await feesRepository.getDueAmountByStudentId(studentId);

    if (Number(amountPaid) > Number(dueAmount.due_amount)) {
      return res.status(400).json({
        success: false,
        message: "Amount can't be greater than the due amount",
      });
    }

    const query = await pool.query(
      `  SELECT receipt_number FROM fee_payments ORDER BY payment_date DESC LIMIT 1`
    );
    const output = query.rows[0].receipt_number;
    const prefix = "MCA-ADM";
    const currentYear = new Date().getFullYear();

    if (query.rowCount > 0) {
      const parts = output.split("-");
      const lastYear = parseInt(parts[2]);
      const count = parseInt(parts[3]);

      if (lastYear == currentYear) {
        const newSerial = String(lastSerial + 1).padStart(3, "0");
        receipt_number = `${prefix}-${currentYear}-${newSerial}`;
      } else {
        receipt_number = `${prefix}-${currentYear}-001`;
      }
    }

    const result = await feesRepository.collectFee(
      studentId,
      feeId,
      amountPaid,
      method,
      status,
      receipt_number
    );
    if (!result) {
      return res
        .status(500)
        .json({ success: false, message: "There is something wrong" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Collected successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "There is something wrong" });
  }
}

async function getFeePaymentsById(req, res) {
  try {
    const { studentId } = req.body;
    const result = await feesRepository.getFeePaymentsById(studentId);
    if (!result) {
      return res
        .status(500)
        .json({ message: "There is some error occured", success: false });
    }
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is some error occured", success: false });
  }
}

module.exports = { fetchAllFees, collectFee, getFeePaymentsById };
