const pool = require("../config/db");
const { foundClaims } = require("../middleware/auth");
const attendanceRepository = require("../repository/attendanceRepository");
const feesRepository = require("../repository/feesRepository");
const FeesRepository = require("../repository/feesRepository");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_test_RgiRbyDxaYiNWu",
  key_secret: "4N6m1N9GHGxx6ZWmK29u463O",
});

async function createOrder(req, res) {
  try {
    let feeId;
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const user = await foundClaims(req);
    if (!user) {
      return res.status(256).json({ message: "unauthorized" });
    }

    const studentId = await attendanceRepository.getStudentIdFromUserId(
      user.id
    );

    const queryOne = await pool.query(
      `
    select id from student_fees  WHERE student_id=$1
  `,
      [studentId[0].id]
    );

    if (queryOne.rowCount > 0) {
      feeId = queryOne.rows[0].id;

      const order = await razorpay.orders.create(options);

      const inserted = await pool.query(
        `INSERT INTO orders (razorpay_order_id, student_id, student_fee_id, amount, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
        [order.id, studentId[0].id, feeId, amount, "created"]
      );

      const dbOrderId = inserted.rows[0].id;

      // Send data back to frontend
      res.json({
        success: true,
        razorpay_order_id: order.id, // very important
        db_order_id: dbOrderId,
        amount: amount,
        currency: "INR",
      });
    }
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
}

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

async function GenerateTransactionId() {
  try {
    const prefix = "TXN";
    const currentYear = new Date().getFullYear();

    // Get last transaction_id
    const query = await pool.query(`
      SELECT transaction_id 
      FROM fee_payments 
      ORDER BY payment_date DESC 
      LIMIT 1
    `);

    if (query.rowCount === 0) {
      return `${prefix}-${currentYear}-001`;
    }

    const lastTxn = query.rows[0].transaction_id;
    const parts = lastTxn.split("-");

    const lastYear = parseInt(parts[1]);
    const lastSerial = parseInt(parts[2]);

    // If new year → reset
    if (lastYear !== currentYear) {
      return `${prefix}-${currentYear}-001`;
    }

    // Increment serial
    const newSerial = String(lastSerial + 1).padStart(3, "0");

    return `${prefix}-${currentYear}-${newSerial}`;
  } catch (error) {
    console.error("Transaction ID generation failed:", error);
    return null;
  }
}
async function GenerateReceiptNumber() {
  try {
    const prefix = "MCA-REC";
    const currentYear = new Date().getFullYear();

    // Get last receipt number
    const query = await pool.query(`
      SELECT receipt_number 
      FROM fee_payments 
      ORDER BY payment_date DESC 
      LIMIT 1
    `);

    // If table empty → start fresh
    if (query.rowCount === 0) {
      return `${prefix}-${currentYear}-001`;
    }

    const lastReceipt = query.rows[0].receipt_number;
    const parts = lastReceipt.split("-");

    const lastYear = parseInt(parts[2]);
    const lastSerial = parseInt(parts[3]);

    // If year changed → restart serial
    if (lastYear !== currentYear) {
      return `${prefix}-${currentYear}-001`;
    }

    // Increment serial
    const newSerial = String(lastSerial + 1).padStart(3, "0");

    return `${prefix}-${currentYear}-${newSerial}`;
  } catch (error) {
    console.error("Receipt number generation failed:", error);
    return null;
  }
}

async function payFees(req, res) {
  let feeId;
  try {
    let receipt_number = await GenerateReceiptNumber();
    let transactionId = await GenerateTransactionId();

    if (!transactionId || !receipt_number) {
      return res.status(400).json({
        message: "Receipt and Transaction ID are required",
        success: false,
      });
    }

    // 3️⃣ Extract data from frontend
    const {
      db_order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;

    const user = await foundClaims(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const studentId = await attendanceRepository.getStudentIdFromUserId(
      user.id
    );

    const queryOne = await pool.query(
      `select id from student_fees  WHERE student_id=$1`,
      [studentId[0].id]
    );
    if (queryOne.rowCount > 0) {
      feeId = queryOne.rows[0].id;
    }

    const crypto = require("crypto");
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", "4N6m1N9GHGxx6ZWmK29u463O")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature. Possible fraudulent payment.",
      });
    }

    // 6️⃣ Update order status
    await pool.query("UPDATE orders SET status='paid' WHERE id=$1", [
      db_order_id,
    ]);

    // 7️⃣ Insert into fee_payments
    const result = await FeesRepository.payFees(
      db_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      "Razorpay",
      "success",
      receipt_number,
      transactionId,
      feeId,
      studentId[0].id
    );

    if (result > 0) {
      return res.status(200).json({
        message: "Payment verified and saved successfully",
        success: true,
      });
    } else {
      return res.status(500).json({
        message: "Error inserting payment",
        success: false,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = {
  fetchAllFees,
  collectFee,
  getFeePaymentsById,
  fetchFeesByStudent,
  feesByStudent,
  payFees,
  createOrder,
};
