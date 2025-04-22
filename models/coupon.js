"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Coupon.belongsTo(models.Course, { foreignKey: "courseId" });
    }
  }
  Coupon.init(
    {
      code: { type: DataTypes.STRING(20), unique: true, allowNull: false },
      discount: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
      courseId: DataTypes.INTEGER,
      expiresAt: DataTypes.DATE,
      usageLimit: {
        type: DataTypes.INTEGER,
        allowNull: true, // Nullable for unlimited usage
      },
      timesUsed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Coupon",
      tableName: "Coupons",
      timestamps: true,
    }
  );
  return Coupon;
};
