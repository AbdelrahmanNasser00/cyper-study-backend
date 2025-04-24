"use strict";
const { options } = require("joi");
const { Model, where } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.User, { foreignKey: "userId" });
      Review.belongsTo(models.Course, { foreignKey: "courseId" });
    }
  }
  Review.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      rating: { type: DataTypes.INTEGER, allowNull: false },
      comment: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "Reviews",
      timestamps: true,
      indexes: [{ unique: true, fields: ["userId", "courseId"] }],
    }
  );

  // hooks to update the rating after add, update and delete reviews
  Review.addHook("afterSave", async (review, options) => {
    const { Course, Review } = sequelize.models;
    const reveiws = await Review.findAll({
      where: { courseId: review.courseId },
      attributes: ["rating"],
    });

    const total = reveiws.reduce((sum, r) => sum + r.rating, 0);
    const count = reveiws.length;
    const avg = count > 0 ? total / count : 0;
    await Course.update(
      {
        averageRating: avg.toFixed(1),
        ratingCount: count,
      },
      { where: { id: review.courseId } }
    );
  });

  Review.addHook("afterDestroy", async (review, options) => {
    const { Course, Review } = sequelize.models;
    const reviews = await Review.findAll({
      where: { courseId: review.courseId },
      attributes: ["rating"],
    });

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const count = reviews.length;
    const avg = count > 0 ? total / count : 0;

    await Course.update(
      {
        averageRating: avg.toFixed(1),
        ratingCount: count,
      },
      { where: { id: review.courseId } }
    );
  });

  return Review;
};
