"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cart.belongsTo(models.User, { foreignKey: "userId" });
      Cart.belongsTo(models.Course, { foreignKey: "courseId" });
    }
  }
  Cart.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      addedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: "Cart",
      tableName: "Cart",
      timestamps: false,
      indexes: [{ unique: true, fields: ["userId", "courseId"] }],
    }
  );
  return Cart;
};
