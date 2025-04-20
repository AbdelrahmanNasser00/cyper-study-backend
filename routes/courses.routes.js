const router = require("express").Router();
const validator = require("express-joi-validation").createValidator({});
const { courseController } = require("../config/DIContainer");
const courseSchema = require("../validation/course.validation");
const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API for managing courses
 */

// Instructor routes
/**
 * @swagger
 * /api/courses/:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *                 format: url
 *               level:
 *                 type: string
 *               duration:
 *                 type: number
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  validator.body(courseSchema),
  authenticate,
  authorize(["instructor"]),
  courseController.createCourse
);

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses for the logged-in instructor
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/my-courses",
  authenticate,
  authorize(["instructor"]),
  courseController.getInstructorCourses
);

/**
 * @swagger
 * /courses/my-courses/{id}:
 *   get:
 *     summary: Get a specific course by ID for the logged-in instructor
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/my-courses/:id",
  authenticate,
  authorize(["instructor"]),
  courseController.getInstructorCourseById
);

router.put(
  "/my-courses/:id",
  authenticate,
  authorize(["instructor"]),
  courseController.updateCourse
);
router.delete(
  "/my-courses/:id",
  authenticate,
  authorize(["instructor", "admin"]),
  courseController.deleteCourse
);

// Student Routes
router.get(
  "/my-enrollments",
  authenticate,
  authorize(["student"]),
  courseController.getStudentEnrolledCourses
);

// router.get(
//   "/my-enrollments/:id",
//   authenticate,
//   authorize(["student"]),
//   courseController.getEnrollmentById
// );

// General Routes
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.get("/search", courseController.searchCourses);
router.get("/category/:category", courseController.getCoursesByCategory);

module.exports = router;
