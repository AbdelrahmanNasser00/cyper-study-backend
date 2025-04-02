"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Wishlist.belongsTo(models.User, { foreignKey: "userId" });
      Wishlist.belongsTo(models.Course, { foreignKey: "courseId" });
    }
  }
  Wishlist.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      addedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: "Wishlist",
      tableName: "Wishlist",
      timestamps: false,
      indexes: [{ unique: true, fields: ["userId", "courseId"] }],
    }
  );
  return Wishlist;
};
