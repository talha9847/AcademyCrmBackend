const feesController = require("../controllers/feesController");
const express = require("express");
const router = express.Router();

router.get("/fetchFees", feesController.fetchAllFees);
router.post("/collectFees", feesController.collectFee);
router.post("/getFeesPaymentById", feesController.getFeePaymentsById);
router.get("/fetchFeesByStudent", feesController.fetchFeesByStudent);
router.get("/feesByStudent", feesController.feesByStudent);
router.post ("/payFees", feesController.payFees);

module.exports = router;
