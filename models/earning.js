"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Earning extends Model {
    static associate(models) {
      Earning.belongsTo(models.User, { foreignKey: "instructorId" });
      Earning.belongsTo(models.Course, { foreignKey: "courseId" });
    }
  }
  Earning.init(
    {
      instructorId: { type: DataTypes.INTEGER, allowNull: false },
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      totalEarnings: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    },
    {
      sequelize,
      modelName: "Earning",
      tableName: "Earnings",
      timestamps: true,
    }
  );
  return Earning;
};
