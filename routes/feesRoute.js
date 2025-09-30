const feesController = require('../controllers/feesController');
const express = require('express');
const router = express.Router();

router.get("/fetchFees", feesController.fetchAllFees);

module.exports = router;