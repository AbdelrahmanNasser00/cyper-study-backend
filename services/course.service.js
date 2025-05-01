const { Op } = require("sequelize");

class CourseService {
  constructor(
    CourseModel,
    UserModel,
    EnrollmentModel,
    LessonModel,
    CategoryModel,
    ProgressModel,
    AppErrors
  ) {
    this.CourseModel = CourseModel;
    this.UserModel = UserModel;
    this.EnrollmentModel = EnrollmentModel;
    this.LessonModel = LessonModel;
    this.CategoryModel = CategoryModel;
    this.ProgressModel = ProgressModel;
    this.AppErrors = AppErrors;
  }
  async createCourse(data, instructorId) {
    // Check if a course with the same title and instructor already exists
    const existingCourse = await this.CourseModel.findOne({
      where: {
        title: data.title,
        instructorId,
      },
    });

    if (existingCourse) {
      throw new this.AppErrors(
        "A course with this title already exists for this instructor",
        400
      );
    }

    // Create the course if it doesn't exist
    const course = await this.CourseModel.create({
      ...data,
      instructorId,
    });

    console.log(course);
    return course;
  }
  async getTopCourses(instructorId) {
    try {
      const courses = await this.CourseModel.findAll({
        where: { instructorId },
        order: [["rating", "DESC"]],
        limit: 5,
      });

      return courses;
    } catch (error) {
      next(error);
    }
  }
  async getInstructorCourses(instructorId) {
    const courses = await this.CourseModel.findAll({
      where: { instructorId },
    });
    return courses;
  }

  async getInstructorCourseById(courseId, instructorId) {
    const course = await this.CourseModel.findByPk(courseId, {
      include: [
        {
          model: this.UserModel,
          as: "instructor",
          attributes: ["firstname", "lastname"],
        },
      ],
    });
    if (!course) {
      throw new this.AppErrors("Course not found", 404);
    }
    return course;
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

  async getStudentEnrolledCourses(userId) {
    const courses = await this.CourseModel.findAll({
      include: [
        {
          model: this.EnrollmentModel,
          where: { userId },
          attributes: ["progress", "createdAt"],
        },
      ],
      attributes: ["id", "title", "description", "price"],
    });
    return courses;
  }

  async getStudentEnrolledCourseById(userId, courseId) {
    try {
      const course = await this.CourseModel.findOne({
        where: { id: courseId },
        include: [
          {
            model: this.EnrollmentModel,
            where: { userId },
            attributes: ["progress", "createdAt"], // Enrollment details
          },
          {
            model: this.LessonModel,
            attributes: ["id", "title", "order", "isPreview"], // Lesson details
            include: [
              {
                model: this.ProgressModel,
                where: { userId },
                required: false, // Include progress even if not completed
                attributes: ["isCompleted", "completedAt"],
              },
            ],
          },
        ],
        attributes: ["id", "title", "description", "price", "createdAt"], // Course details
      });

      if (!course) {
        throw new this.AppErrors("Course not found or not enrolled", 404);
      }

      return course;
    } catch (error) {
      console.error("Error in getStudentEnrolledCourseById:", error.message);
      throw new this.AppErrors("Failed to fetch enrolled course details", 500);
    }
  }

  async getCourseById(courseId, userId = null) {
    const include = [
      {
        model: this.UserModel,
        as: "instructor",
        attributes: ["firstname", "lastname"],
      },
    ];
    if (userId) {
      include.push({
        model: this.EnrollmentModel,
        where: { studentId: userId },
        attributes: ["courseId", "progress", "enrolledAt"],
      });
    }
    const course = await this.CourseModel.findByPk(courseId, {
      include,
    });
    if (!course) {
      throw new this.AppErrors("Course not found", 404);
    }

    if (
      !course.isPublished &&
      (!userId || !course.Enrollments || course.Enrollments.length === 0)
    ) {
      throw new this.AppErrors("Course not available", 403);
    }

    let lessons = [];
    if (userId && course.Enrollments && course.Enrollments.length > 0) {
      lessons = await this.LessonModel.findAll({
        where: { courseId },
        order: [["order", "ASC"]],
      });
    } else {
      lessons = await this.LessonModel.findAll({
        where: { courseId, isPreview: true },
        order: [["order", "ASC"]],
      });
    }
    course.dataValues.lessons = lessons;
    return course;
  }
  async getAllCourses() {
    const courses = await this.CourseModel.findAll({
      where: { isPublished: true },
      include: [
        {
          model: this.UserModel,
          as: "instructor",
          attributes: ["firstname", "lastname"],
        },
      ],
    });
    return courses;
  }

  async searchCourses(query) {
    const courses = await this.CourseModel.findAll({
      where: { isPublished: true, title: { [Op.like]: `%${query}%` } },
      include: [
        {
          model: this.UserModel,
          as: "instructor",
          attributes: ["firstname", "lastname"],
        },
      ],
    });
    return courses;
  }

  async getCoursesByCategory(categoryName) {
    const category = await this.CategoryModel.findOne({
      where: { name: categoryName },
    });
    if (!category) {
      throw new this.AppErrors("Category not found", 404);
    }
    const courses = await category.getCourses({
      where: { isPublished: true },
      include: [
        {
          model: this.UserModel,
          as: "instructor",
          attributes: ["firstname", "lastname"],
        },
      ],
    });
    return courses;
  }
}

module.exports = CourseService;
