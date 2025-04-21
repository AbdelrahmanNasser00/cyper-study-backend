class LessonController {
    constructor(lessonService) {
      this.lessonService = lessonService;
    }

  getLessonById=async (req, res, next)=> {
    try {
      const lesson = await this.lessonService.getLessonById(req.params.id);
      res.status(200).json(lesson);
    } catch (err) {
      next(err);
    }
  };

   getLessonsByCourse=async (req, res, next) =>{
    try {
      const { courseId } = req.params;
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 lessons per page

      const offset = (page - 1) * limit;
      const lessons = await this.lessonService.getLessonsByCourse(courseId, limit, offset);

      res.status(200).json(lessons);
    } catch (err) {
      next(err);
    }
  }

  createLesson= async(req, res, next)=> {
    try {
      const lesson = await this.lessonService.createLesson(req.body);
      res.status(201).json(lesson);
    } catch (err) {
      next(err);
    }
  }

   updateLesson= async(req, res, next)=> {
    try {
      const lesson = await this.lessonService.updateLesson(req.params.id, req.body);
      res.status(200).json(lesson);
    } catch (err) {
      next(err);
    }
  }
 deleteLesson= async(req, res, next)=> {
    try {
      await this.lessonService.deleteLesson(req.params.id);
      res.status(204).send(); 
    } catch (err) {
      next(err);
    }
  }
  markLessonAsCompleted= async(req, res, next)=> {
    try {
      const lesson = await this.lessonService.markLessonAsCompleted(req.params.id);
      res.status(200).json(lesson);
    } catch (err) {
      next(err);
    }
  }

  searchLessons = async (req, res, next) => {
    try {
      const { query } = req.query; // Search query
      const lessons = await this.lessonService.searchLessons(query);

      res.status(200).json(lessons);
    } catch (err) {
      next(err);
    }
  };

  reorderLessons = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      const { order } = req.body; // Array of lesson IDs in the desired order

      await this.lessonService.reorderLessons(courseId, order);

      res.status(200).json({ message: "Lessons reordered successfully" });
    } catch (err) {
      next(err);
    }
  };
};

module.exports = LessonController;
