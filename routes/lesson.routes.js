const express = require("express");
const router = express.Router();

const { lessonController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/role.middleware");


router.get("/:id", authenticate,lessonController.getLessonById);
router.get("/course/:courseId", authenticate, lessonController.getLessonsByCourse);
router.post("/", authenticate, authorize(["instructor", "admin"]), lessonController.createLesson);
router.put("/:id", authenticate, authorize(["instructor", "admin"]), lessonController.updateLesson);
router.patch("/:id/complete", authenticate, lessonController.markLessonAsCompleted);
router.delete("/:id", authenticate, authorize(["instructor", "admin"]), lessonController.deleteLesson);

module.exports = router;
