"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payment.belongsTo(models.Order, { foreignKey: "orderId" });
      Payment.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Payment.init(
    {
      orderId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      amount: DataTypes.DECIMAL(10, 2),
      paymentMethod: DataTypes.ENUM("credit_card", "paypal", "other"),
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        defaultValue: "pending",
      },
      transactionId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "Payments",
      timestamps: true,
    }
  );
  return Payment;
};
