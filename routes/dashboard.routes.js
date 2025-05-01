const express = require("express");
const router = express.Router();
const { dashboardController } = require("../config/DIContainer");
const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard-related endpoints
 */

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get instructor dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCourses:
 *                   type: integer
 *                   description: Total number of courses
 *                 totalStudents:
 *                   type: integer
 *                   description: Total number of students
 *                 totalCertificates:
 *                   type: integer
 *                   description: Total number of certificates
 *                 totalReviews:
 *                   type: integer
 *                   description: Total number of reviews
 *                 totalEarnings:
 *                   type: string
 *                   description: Total earnings
 */
router.get(
  "/summary",
  authenticate,
  authorize(["instructor"]),
  dashboardController.summary
);

/**
 * @swagger
 * /dashboard/ratings-summary:
 *   get:
 *     summary: Get average ratings summary for instructor
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Average ratings summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageRating:
 *                   type: string
 *                   description: Average rating
 */
router.get(
  "/ratings-summary",
  authenticate,
  authorize(["instructor"]),
  dashboardController.getRatingsSummary
);

/**
 * @swagger
 * /dashboard/course-performance/{courseId}:
 *   get:
 *     summary: Get performance details for a specific course
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course performance details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEarnings:
 *                   type: string
 *                   description: Total earnings for the course
 *                 totalStudents:
 *                   type: integer
 *                   description: Total students enrolled
 *                 totalReviews:
 *                   type: integer
 *                   description: Total reviews for the course
 *                 totalCertificates:
 *                   type: integer
 *                   description: Total certificates issued
 *                 studentsProgress:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       studentId:
 *                         type: integer
 *                         description: Student ID
 *                       studentName:
 *                         type: string
 *                         description: Student name
 *                       studentEmail:
 *                         type: string
 *                         description: Student email
 *                       progress:
 *                         type: number
 *                         description: Progress percentage
 *                       enrolledAt:
 *                         type: string
 *                         format: date-time
 *                         description: Enrollment date
 */
router.get(
  "/course-performance/:courseId",
  authenticate,
  authorize(["instructor"]),
  dashboardController.getCoursePerformance
);

/**
 * @swagger
 * /dashboard/earnings/monthly:
 *   get:
 *     summary: Get monthly earnings breakdown for instructor
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly earnings breakdown
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   year:
 *                     type: integer
 *                     description: Year of the earnings
 *                   month:
 *                     type: integer
 *                     description: Month of the earnings
 *                   totalEarnings:
 *                     type: string
 *                     description: Total earnings for the month
 */
router.get(
  "/earnings/monthly",
  authenticate,
  authorize(["instructor"]),
  dashboardController.getMonthlyEarningsBreakdown
);

module.exports = router;
