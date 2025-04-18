const router = require("express").Router();
const validator = require("express-joi-validation").createValidator({});
const { authController } = require("../config/DIContainer");
const courseSchema = require("../validation/course.validation");

router.post("/", validator.body(courseSchema), authController.createCourse);

module.exports = router;
