class ProgressService {
  constructor(
    ProgressModel,
    UserModel,
    LessonModel,
    EnrollmentModel,
    AppErrors
  ) {
    this.ProgressModel = ProgressModel;
    this.UserModel = UserModel;
    this.LessonModel = LessonModel;
    this.EnrollmentModel = EnrollmentModel;
    this.AppErrors = AppErrors;
  }

  async markLessonCompleted(userId, courseId, lessonId) {
    const lesson = await this.LessonModel.findByPk(lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    const [progress, created] = await this.ProgressModel.findOrCreate({
      where: { userId, courseId, lessonId },
      defaults: { isCompleted: true, completedAt: new Date() },
    });

    // If it already exists but not completed
    if (!created && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
      await progress.save();
    }
    const { progressPercentage } = await this.getCourseProgress(
      userId,
      courseId
    );
    await this.EnrollmentModel.update(
      { progress: progressPercentage },
      { where: { userId, courseId } }
    );
    return { message: "Lesson marked as completed" };
  }

  async getCourseProgress(userId, courseId) {
    const totalLessons = await this.LessonModel.count({ where: { courseId } });

    const completedProgresses = await this.ProgressModel.findAll({
      where: { userId, courseId, isCompleted: true },
      attributes: ["lessonId"],
      raw: true,
    });

    const completedLessons = completedProgresses.length;
    const completedLessonIds = completedProgresses.map((p) => p.lessonId);

    const progressPercentage =
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100);

    return {
      totalLessons,
      completedLessons,
      progressPercentage,
      completedLessonIds,
    };
  }
}

module.exports = ProgressService;
