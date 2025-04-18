const router = require("express").Router();
const validator = require("express-joi-validation").createValidator({});
const { courseController } = require("../config/DIContainer");
const courseSchema = require("../validation/course.validation");

router.post("/", validator.body(courseSchema), courseController.createCourse);

module.exports = router;
