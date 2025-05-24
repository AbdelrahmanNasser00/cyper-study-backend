const express = require("express");
const router = express.Router();

const { ProgressController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Progress tracking for courses and lessons
 */

/**
 * @swagger
 * /progress/mark-completed:
 *   post:
 *     summary: Mark a lesson as completed
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - lessonId
 *             properties:
 *               courseId:
 *                 type: integer
 *                 description: ID of the course
 *               lessonId:
 *                 type: integer
 *                 description: ID of the lesson
 *             example:
 *               courseId: 101
 *               lessonId: 202
 *     responses:
 *       200:
 *         description: Lesson marked as completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 */
router.post(
  "/mark-completed",
  authenticate,
  ProgressController.markLessonCompleted
);

/**
 * @swagger
 * /progress/course-progress/{courseId}:
 *   get:
 *     summary: Get progress for a specific course
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the course
 *     responses:
 *       200:
 *         description: Course progress details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalLessons:
 *                   type: integer
 *                   description: Total number of lessons in the course
 *                 completedLessons:
 *                   type: integer
 *                   description: Number of lessons completed by the student
 *                 progressPercentage:
 *                   type: number
 *                   format: float
 *                   description: Percentage of course progress
 *               example:
 *                 totalLessons: 10
 *                 completedLessons: 7
 *                 progressPercentage: 70
 */
router.get(
  "/course-progress/:courseId",
  authenticate,
  ProgressController.getCourseProgress
);

module.exports = router;
