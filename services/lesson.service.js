class LessonService {
    constructor(LessonModel, AppErrors) {
      this.LessonModel = LessonModel;
      this.AppErrors = AppErrors;
    }
  
    async getLessonById(id) {
      const lesson = await this.LessonModel.findByPk(id);
      if (!lesson) {
        throw new this.AppErrors("Lesson not found", 404);
      }
      return lesson;
    }
  
    async getLessonsByCourse(courseId) {
      const lessons = await this.LessonModel.findAll({
        where: { courseId },
        order: [["order", "ASC"]],
      });
      return lessons;
    }
  
    async createLesson(data) {
      const lesson = await this.LessonModel.create(data);
      return lesson;
    }
  
    async updateLesson(id, data) {
      const lesson = await this.LessonModel.findByPk(id);
      if (!lesson) {
        throw new this.AppErrors("Lesson not found", 404);
      }
      await lesson.update(data);
      return lesson;
    }
  
    async deleteLesson(id) {
      const lesson = await this.LessonModel.findByPk(id);
      if (!lesson) {
        throw new this.AppErrors("Lesson not found", 404);
      }
      await lesson.destroy();
      return lesson;
    }
    async markLessonAsCompleted(id){
      const lesson=await this.LessonModel.findByPk(id);
      if (!lesson) {
        throw new this.AppErrors("Lesson not found", 404);
      }
      await lesson.update({isPreview:true});
      return lesson;


    }
  }
  
  module.exports = LessonService;
  