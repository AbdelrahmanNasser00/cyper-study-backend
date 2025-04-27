const express = require("express");
const router = express.Router();

const { progressController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
router.post(
  "/mark-completed",
  authenticate,
  progressController.markLessonCompleted
);
router.get(
  "/course-progress/:courseId",
  authenticate,
  progressController.getCourseProgress
);

module.exports = router;
