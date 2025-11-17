const pool = require("../config/db");
const { foundClaims } = require("../middleware/auth");
const attendanceRepository = require("../repository/attendanceRepository");
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
    let transactionId = "";
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
        const newSerial = String(count + 1).padStart(3, "0");
        receipt_number = `${prefix}-${currentYear}-${newSerial}`;
      } else {
        receipt_number = `${prefix}-${currentYear}-001`;
      }
    } else {
      const prefix = "MCA-ADM";
      const currentYear = new Date().getFullYear();
      receipt_number = `${prefix}-${currentYear}-001`;
    }

    const txnQuery = await pool.query(
      "SELECT transaction_id FROM fee_payments ORDER BY payment_date DESC LIMIT 1"
    );
    const txnOutput = txnQuery.rows[0].transaction_id;
    const txnPrefix = "TXN";
    const txnCurrentYear = new Date().getFullYear();

    if (txnQuery.rowCount > 0) {
      const parts = txnOutput.split("-");
      const lastYear = parseInt(parts[1]);
      const number = parseInt(parts[2]);

      if (lastYear == txnCurrentYear) {
        const newSerial = String(number + 1).padStart(3, "0");
        transactionId = `${txnPrefix}-${currentYear}-${newSerial}`;
      }
    } else {
      transactionId = `${txnPrefix}-${currentYear}-001`;
    }

    if (!transactionId || !receipt_number) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const result = await feesRepository.collectFee(
      studentId,
      feeId,
      amountPaid,
      method,
      status,
      receipt_number,
      transactionId
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
    console.log(error);
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

async function fetchFeesByStudent(req, res) {
  try {
    const user = await foundClaims(req);
    const studentId = await attendanceRepository.getStudentIdFromUserId(
      user.id
    );
    if (!studentId[0].id || isNaN(studentId[0].id)) {
      return res.status(256).json({ message: "unauthorized", success: false });
    }
    const result = await feesRepository.fetchFeesByStudent(studentId[0].id);
    if (!result) {
      return res.status(500).json({ message: "Error", success: false });
    }
    return res
      .status(200)
      .json({ message: "Ok got it", success: true, data: result });
  } catch (error) {
    return res.status(500).json({ message: "Ok got it", success: false });
  }
}

async function feesByStudent(req, res) {
  try {
    const user = await foundClaims(req);
    const studentId = await attendanceRepository.getStudentIdFromUserId(
      user.id
    );
    const result = await feesRepository.getFeePaymentsById(studentId[0].id);
    if (!result) {
      return res
        .status(500)
        .json({ message: "There is some error occured", success: false });
    }
    return res
      .status(200)
      .json({ success: true, data: result, message: "Found successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "There is some error occured", success: false });
  }
}

async function payFees(req, res) {
  let feeId;
  let receipt_number = "";
  let transactionId = "";

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
      const newSerial = String(count + 1).padStart(3, "0");
      receipt_number = `${prefix}-${currentYear}-${newSerial}`;
    } else {
      receipt_number = `${prefix}-${currentYear}-001`;
    }
  } else {
    const prefix = "MCA-ADM";
    const currentYear = new Date().getFullYear();
    receipt_number = `${prefix}-${currentYear}-001`;
  }

  const txnQuery = await pool.query(
    "SELECT transaction_id FROM fee_payments ORDER BY payment_date DESC LIMIT 1"
  );
  const txnOutput = txnQuery.rows[0].transaction_id;
  const txnPrefix = "TXN";
  const txnCurrentYear = new Date().getFullYear();

  if (txnQuery.rowCount > 0) {
    const parts = txnOutput.split("-");
    const lastYear = parseInt(parts[1]);
    const number = parseInt(parts[2]);

    if (lastYear == txnCurrentYear) {
      const newSerial = String(number + 1).padStart(3, "0");
      transactionId = `${txnPrefix}-${currentYear}-${newSerial}`;
    }
  } else {
    transactionId = `${txnPrefix}-${currentYear}-001`;
  }

  if (!transactionId || !receipt_number) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }

  const { fees, razorPayId } = req.body;
  const user = await foundClaims(req);
  if (!user) {
    return res.status(256).json({ message: "unauthorized" });
  }

  const studentId = await attendanceRepository.getStudentIdFromUserId(user.id);

  const queryOne = await pool.query(
    `SELECT sf.id FROM fee_payments f
      JOIN student_fees sf
      ON sf.id=f.student_fee_id
      where sf.student_id=$1`,
    [studentId[0].id]
  );

  if (queryOne.rowCount > 0) {
    feeId = queryOne.rows[0].id;
    console.log(studentId[0].id, feeId, fees, receipt_number, transactionId);
    const result = await FeesRepository.payFees(
      studentId[0].id,
      feeId,
      fees,
      "UPI",
      "PAID",
      receipt_number,
      transactionId
    );
    if (result > 0) {
      return res
        .status(200)
        .json({ message: "some error occured", success: false });
    }
    return res.status(200).json({ message: "Ok got it", success: true });
  }
  return res.status(200).json({ message: "goo to seeess" });
}

module.exports = {
  fetchAllFees,
  collectFee,
  getFeePaymentsById,
  fetchFeesByStudent,
  feesByStudent,
  payFees,
};
