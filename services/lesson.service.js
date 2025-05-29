const { Op } = require("sequelize");

class LessonService {
    constructor(LessonModel, AppErrors, sequelize) {
      this.LessonModel = LessonModel;
      this.AppErrors = AppErrors;
      this.sequelize = sequelize;
    }
  
    async getLessonById(id) {
      const lesson = await this.LessonModel.findByPk(id);
      if (!lesson) {
        throw new this.AppErrors("Lesson not found", 404);
      }
      return lesson;
    }
  
    async getLessonsByCourse(courseId, limit, offset) {
      const lessons = await this.LessonModel.findAll({
        where: { courseId },
        order: [["order", "ASC"]],
       
      });
  
      return lessons;
    }
  
    async createLesson(data) {
      console.log(data)
      const lesson = await this.LessonModel.create({
        ...data});

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

    async searchLessons(query) {
      const lessons = await this.LessonModel.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { content: { [Op.like]: `%${query}%` } },
          ],
        },
        order: [["title", "ASC"]],
      });
    
      return lessons;
    }

    async reorderLessons(courseId, order) {
      const transaction = await this.sequelize.transaction();
    
      try {
        for (let i = 0; i < order.length; i++) {
          await this.LessonModel.update(
            { order: i + 1 },
            { where: { id: order[i], courseId }, transaction }
          );
        }
    
        await transaction.commit();
      } catch (err) {
        await transaction.rollback();
        throw new this.AppErrors("Failed to reorder lessons", 500);
      }
    }
  }
  
  module.exports = LessonService;
