const feesController = require('../controllers/feesController');
const express = require('express');
const router = express.Router();

router.get("/fetchFees", feesController.fetchAllFees);
router.post("/collectFees", feesController.collectFee);
router.post("/getFeesPaymentById", feesController.getFeePaymentsById)

module.exports = router;