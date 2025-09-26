var express = require('express');
const router = express.Router();
const slugController = require('../controllers/slugController');

router.get('/getSlugs', slugController.getSlugs);

module.exports = router;
