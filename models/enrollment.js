"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Enrollment.belongsTo(models.User, { foreignKey: "userId" });
      Enrollment.belongsTo(models.Course, { foreignKey: "courseId" });
    }
  }
  Enrollment.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      progress: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.0 },
      enrolledAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: "Enrollment",
      tableName: "Enrollments",
      timestamps: false,
      indexes: [{ unique: true, fields: ["userId", "courseId"] }],
    }
  );
  return Enrollment;
};
