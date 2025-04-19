const router = require("express").Router();
const validator = require("express-joi-validation").createValidator({});
const { courseController } = require("../config/DIContainer");
const courseSchema = require("../validation/course.validation");
const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/role.middleware");

// Instructor routes
router.post(
  "/",
  validator.body(courseSchema),
  authenticate,
  authorize(["instructor"]),
  courseController.createCourse
);
router.get(
  "/my-courses",
  authenticate,
  authorize(["instructor"]),
  courseController.getInstructorCourses
);
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
