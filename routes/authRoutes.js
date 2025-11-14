var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/access", authController.checkAccess);
router.post("/roleAccess", authController.checkRoleAccess);
router.post("/logout", authController.logout);
router.get("/fetchdata/:id", authController.getCloseContests);
module.exports = router;
