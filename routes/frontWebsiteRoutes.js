const express = require('express');
const router = express.Router();
const frontWebsiteController = require('../controllers/frontWebsiteController')

router.get("/getCourses", frontWebsiteController.getCourses)

module.exports = router;