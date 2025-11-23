const extras = require("../controllers/extraController");
var express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

router.get(
  "/getClasses",
  authMiddleware.authMiddleware(["admin", "teacher"]),
  extras.getAllClasses
);

router.post(
  "/updateClass",
  authMiddleware.authMiddleware("admin"),
  extras.updateClass
);
router.post(
  "/updateSession",
  authMiddleware.authMiddleware("admin"),
  extras.updateSessions
);

router.post(
  "/addClass",
  authMiddleware.authMiddleware("admin"),
  extras.addClass
);
router.post(
  "/addSession",
  authMiddleware.authMiddleware("admin"),
  extras.addSession
);

router.get(
  "/getSessions",
  authMiddleware.authMiddleware(["admin", "teacher"]),
  extras.getAllSessions
);

router.get(
  "/getSections",
  authMiddleware.authMiddleware("admin"),
  extras.getAllSections
);

router.get(
  "/getSectionById",
  authMiddleware.authMiddleware("admin"),
  extras.getSectionById
);
router.get(
  "/getTeachers",
  authMiddleware.authMiddleware(["admin"]),
  extras.getTeachers
);
router.get(
  "/getStudents",
  authMiddleware.authMiddleware(["admin"]),
  extras.getStudents
);
router.post(
  "/getSlugByUserId",
  authMiddleware.authMiddleware(["admin"]),
  extras.getSlugByUserId
);
router.put(
  "/toggleSlug",
  authMiddleware.authMiddleware(["admin"]),
  extras.toggleSlug
);
router.post(
  "/getCertificateById",
  authMiddleware.authMiddleware(["admin"]),
  extras.getCertificateById
);

router.put(
  "/updateCertificate",
  authMiddleware.authMiddleware(["admin"]),
  extras.updateCertificate
);
module.exports = router;
