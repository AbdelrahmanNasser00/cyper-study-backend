"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Course.belongsTo(models.User, {
        as: "instructor",
        foreignKey: "instructorId",
      });

      Course.belongsTo(models.Category, { foreignKey: "categoryId" });
      Course.hasMany(models.Progress, {
        foreignKey: "courseId",
        as: "progresses",
      });
      Course.hasMany(models.Lesson, { foreignKey: "courseId" });
      Course.hasMany(models.Coupon, { foreignKey: "courseId" });
      Course.hasMany(models.OrderItem, { foreignKey: "courseId" });
      Course.belongsToMany(models.User, {
        through: models.Enrollment,
        foreignKey: "courseId",
        otherKey: "userId",
      });

      Course.belongsToMany(models.User, {
        through: models.Wishlist,
        foreignKey: "courseId",
        otherKey: "userId",
      });

      Course.belongsToMany(models.User, {
        through: models.Certificate,
        foreignKey: "courseId",
        otherKey: "userId",
      });
      Course.hasMany(models.Review, {
        foreignKey: "courseId",
        onDelete: "CASCADE",
      });
      Course.hasMany(models.CartItems, { foreignKey: "courseId" });
      Course.hasOne(models.Earning, { foreignKey: "courseId", as: "earning" });
      Course.hasMany(models.Enrollment, { foreignKey: "courseId" });
    }
  }
  Course.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
      categoryId: { type: DataTypes.INTEGER, allowNull: false },
      instructorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
      thumbnail: DataTypes.STRING,
      level: DataTypes.ENUM("beginner", "intermediate", "advanced"),
      duration: DataTypes.INTEGER,
      isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
      averageRating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.0,
        allowNull: false,
      },
      ratingCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Course",
      tableName: "Courses",
      timestamps: true,
    }
  );
  return Course;
};
