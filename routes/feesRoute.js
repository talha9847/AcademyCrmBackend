const feesController = require('../controllers/feesController');
const express = require('express');
const feesRepository = require('../repository/feesRepository');
const router = express.Router();

router.get("/fetchFees", feesController.fetchAllFees);
router.post("/collectFees", feesController.collectFee);

module.exports = router;