'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Progress extends Model {
    static associate(models) {
      // Progress belongs to a User
      Progress.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      // Progress belongs to a Course
      Progress.belongsTo(models.Course, {
        foreignKey: 'courseId',
        as: 'course',
      });

      // Progress belongs to a Lesson
      Progress.belongsTo(models.Lesson, {
        foreignKey: 'lessonId',
        as: 'lesson',
      });
    }
  }
  Progress.init({
    userId: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER,
    lessonId: DataTypes.INTEGER,
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Progress',
  });
  return Progress;
};
