class ProgressController {
  constructor(progressService) {
    this.progressService = progressService;
  }

  markLessonCompleted = async (req, res, next) => {
    try {
      const { userId } = req.user.id;
      const { courseId, lessonId } = req.body;

      const result = await this.progressService.markLessonCompleted({
        userId,
        courseId,
        lessonId,
      });
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  getCourseProgress = async (req, res, next) => {
    try {
      const { userId } = req.user.id;
      const { courseId } = req.params;

      const result = await this.progressService.getCourseProgress({
        userId,
        courseId,
      });
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ProgressController;
