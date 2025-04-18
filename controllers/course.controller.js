class CourseController {
  constructor(courseService) {
    this.courseService = courseService;
  }

  getInstructorCourses = async (req, res, next) => {
    try {
      const courses = await this.courseService.getInstructorCourses(
        req.user.id
      );
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  };

  createCourse = async (req, res, next) => {
    try {
      const course = await this.courseService.createCourse(req.body);
      res.status(201).json(course);
    } catch (error) {
      next(error);
    }
  };

  updateCourse = async (req, res, next) => {
    try {
      const course = await this.courseService.updateCourse(
        req.params.id,
        req.body
      );
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  };

  getCourseById = async (req, res, next) => {
    try {
      const course = await this.courseService.getCourseById(req.params.id);
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  };

  getCourses = async (req, res, next) => {
    try {
      const courses = await this.courseService.getAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = CourseController;
