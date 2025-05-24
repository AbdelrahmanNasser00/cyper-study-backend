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
 * /api/courses/my-courses:
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
 * /api/courses/my-courses/{id}:
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

/**
 * @swagger
 * /api/courses/my-courses/{id}:
 *   put:
 *     summary: Update a course
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/my-courses/:id",
  authenticate,
  authorize(["instructor"]),
  courseController.updateCourse
);

/**
 * @swagger
 * /api/courses/my-courses/{id}:
 *   delete:
 *     summary: Delete a course
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
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/my-courses/:id",
  authenticate,
  authorize(["instructor", "admin"]),
  courseController.deleteCourse
);

// Student Routes
/**
 * @swagger
 * /api/courses/my-enrollments:
 *   get:
 *     summary: Get all enrolled courses for the logged-in student
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrolled courses
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/my-enrollments",
  authenticate,
  authorize(["student"]),
  courseController.getStudentEnrolledCourses
);

/**
 * @swagger
 * /api/courses/my-enrollments/{id}:
 *   get:
 *     summary: Get details of a specific enrolled course for the logged-in student
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
 *         description: Course details with progress and related
 */
router.get(
  "/my-enrollments/:id",
  authenticate,
  authorize(["student"]),
  courseController.getStudentEnrolledCourseById
);
/**
 * @swagger
 * /api/courses/top:
 *   get:
 *     summary: Get top-rated published courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of top courses to return (default 5)
 *     responses:
 *       200:
 *         description: List of top-rated courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   instructor:
 *                     type: object
 *                     properties:
 *                       firstname:
 *                         type: string
 *                       lastname:
 *                         type: string
 */
router.get("/top", courseController.TopCourses);
// General Routes
/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 */
router.get("/", courseController.getAllCourses);

/**
 * @swagger
 * /api/courses/search:
 *   get:
 *     summary: Search for courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of matching courses
 */
router.get("/search", courseController.searchCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
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
 */
router.get("/:id", courseController.getCourseById);
/**
 * @swagger
 * /api/courses/category/{category}:
 *   get:
 *     summary: Get courses by category
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *     responses:
 *       200:
 *         description: List of courses in the category
 */
router.get("/category/:category", courseController.getCoursesByCategory);

module.exports = router;
