const express = require("express");
const router = express.Router();

const { lessonController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: API for managing lessons
 */

/**
 * @swagger
 * /lessons/{id}:
 *   get:
 *     summary: Get a lesson by ID
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lesson
 *     responses:
 *       200:
 *         description: Lesson details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Lesson not found
 */
router.get("/:id", authenticate, lessonController.getLessonById);

/**
 * @swagger
 * /lessons/course/{courseId}:
 *   get:
 *     summary: Get all lessons for a course
 *     tags: [Lessons]
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
 *         description: List of lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Course not found
 */
router.get(
  "/course/:courseId",
  authenticate,
  lessonController.getLessonsByCourse
);

/**
 * @swagger
 * /lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               courseId:
 *                 type: integer
 *             required:
 *               - title
 *               - content
 *               - courseId
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", authenticate, authorize(["instructor"]), lessonController.createLesson);

/**
 * @swagger
 * /lessons/{id}:
 *   put:
 *     summary: Update a lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lesson
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       404:
 *         description: Lesson not found
 */
router.put("/:id", authenticate, authorize(["instructor", "admin"]), lessonController.updateLesson);

/**
 * @swagger
 * /lessons/{id}/complete:
 *   patch:
 *     summary: Mark a lesson as completed
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lesson
 *     responses:
 *       200:
 *         description: Lesson marked as completed
 *       404:
 *         description: Lesson not found
 */
router.patch("/:id/complete", authenticate, lessonController.markLessonAsCompleted);

/**
 * @swagger
 * /lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lesson
 *     responses:
 *       204:
 *         description: Lesson deleted successfully
 *       404:
 *         description: Lesson not found
 */
router.delete("/:id", authenticate, authorize(["instructor", "admin"]), lessonController.deleteLesson);

/**
 * @swagger
 * /lessons/search:
 *   get:
 *     summary: Search lessons
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of lessons matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/search", authenticate, lessonController.searchLessons);

/**
 * @swagger
 * /lessons/course/{courseId}/reorder:
 *   patch:
 *     summary: Reorder lessons within a course
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Lessons reordered successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Course not found
 */
router.patch(
  "/course/:courseId/reorder",
  authenticate,
  authorize(["instructor"]),
  lessonController.reorderLessons
);

module.exports = router;
