"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Lesson.belongsTo(models.Course, { foreignKey: "courseId" });
    }
  }
  Lesson.init(
    {
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      videoUrl: DataTypes.STRING,
      content: DataTypes.TEXT,
      order: { type: DataTypes.INTEGER, allowNull: false },
      duration: DataTypes.INTEGER,
      isPreview: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "Lesson",
      tableName: "Lessons",
      timestamps: false,
    }
  );
  return Lesson;
};
