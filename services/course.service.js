class CourseService {
  constructor(CourseModel, AppErrors) {
    this.CourseModel = CourseModel;
    this.AppErrors = AppErrors;
  }
  async getCourseById(id) {
    const course = await this.CourseModel.findByPk(id);
    if (!course) {
      throw new this.AppErrors("Course not found", 404);
    }
    return course;
  }
  async createCourse(data) {
    const course = await this.CourseModel.create({
      ...data,
      isPublished: false,
    });
    return course;
  }

  async getInstructorCourses(instructorId) {
    const courses = await this.CourseModel.findAll({
      where: { instructorId },
    });
    return courses;
  }
  async getAllCourses() {
    const courses = await this.CourseModel.findAll({
      where: { isPublished: true },
    });
    return courses;
  }
  async updateCourse(id, data) {
    const course = await this.CourseModel.findByPk(id);
    if (!course) {
      throw new this.AppErrors("Course not found", 404);
    }
    await course.update(data);
    return course;
  }
  async deleteCourse(id) {
    const course = await this.CourseModel.findByPk(id);
    if (!course) {
      throw new this.AppErrors("Course not found", 404);
    }
    await course.destroy();
    return course;
  }
}

module.exports = CourseService;
