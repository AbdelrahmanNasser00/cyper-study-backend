class CourseController {
  constructor(courseService) {
    this.courseService = courseService;
  }

  // Instructor
  createCourse = async (req, res, next) => {
    try {
      const course = await this.courseService.createCourse(
        req.body,
        req.user.id
      );
      res.status(201).json({
        message: "course created successfully.",
        course,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
TopCourses = async (req, res, next) => {
  try {
    // Use static method and pass models from DIContainer or require directly
    const courses = await await this.courseService.TopCourses();
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};
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

  getInstructorCourseById = async (req, res, next) => {
    try {
      const course = await this.courseService.getInstructorCourseById(
        req.params.id,
        req.user.id
      );
      res.status(200).json(course);
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

  deleteCourse = async (req, res, next) => {
    try {
      const course = await this.courseService.deleteCourse(req.params.id);
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  };

  // Student
  getStudentEnrolledCourses = async (req, res, next) => {
    try {
      const courses = await this.courseService.getStudentEnrolledCourses(
        req.user.id
      );
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  };
  getStudentEnrolledCourseById = async (req, res, next) => {
    try {
      const course = await this.courseService.getStudentEnrolledCourseById(
        req.user.id,
        req.params.id
      );
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  };

  // General
  getCourseById = async (req, res, next) => {
    try {
      const userId = req.user ? req.user.id : null;
      const course = await this.courseService.getCourseById(
        req.params.id,
        userId
      );
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  };

  getAllCourses = async (req, res, next) => {
    try {
      const courses = await this.courseService.getAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  };

  searchCourses = async (req, res, next) => {
    try {
      const courses = await this.courseService.searchCourses(req.query);
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  };

  getCoursesByCategory = async (req, res, next) => {
    try {
      const courses = await this.courseService.getCoursesByCategory(
        req.params.category
      );
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = CourseController;
