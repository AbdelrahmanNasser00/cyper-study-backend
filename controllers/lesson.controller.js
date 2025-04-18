
class LessonController {
    constructor(lessonService) {
      this.lessonService = lessonService;
    }

  getLessonById=async (req, res, next)=> {
    try {
      const lesson = await lessonService.getLessonById(req.params.id);
      res.status(200).json(lesson);
    } catch (err) {
      next(err);
    }
  };

   getLessonsByCourse=async (req, res, next) =>{
    try {
      const lessons = await lessonService.getLessonsByCourse(req.params.courseId);
      res.status(200).json(lessons);
    } catch (err) {
      next(err);
    }
  }

  createLesson= async(req, res, next)=> {
    try {
      const lesson = await lessonService.createLesson(req.body);
      res.status(201).json(lesson);
    } catch (err) {
      next(err);
    }
  }

   updateLesson= async(req, res, next)=> {
    try {
      const lesson = await lessonService.updateLesson(req.params.id, req.body);
      res.status(200).json(lesson);
    } catch (err) {
      next(err);
    }
  }
 deleteLesson= async(req, res, next)=> {
    try {
      await lessonService.deleteLesson(req.params.id);
      res.status(204).send(); 
    } catch (err) {
      next(err);
    }
  }
  markLessonAsCompleted= async(req, res, next)=> {
    try {
      const lesson = await lessonService.markLessonAsCompleted(req.params.id);
      res.status(200).json(lesson);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = LessonController;
