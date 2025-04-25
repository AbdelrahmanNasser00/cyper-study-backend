"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CartItems extends Model {
    static associate(models) {
      CartItems.belongsTo(models.Cart, {
        foreignKey: "cartId",
        onDelete: "CASCADE",
      });
      CartItems.belongsTo(models.Course, {
        foreignKey: "courseId",
        onDelete: "CASCADE",
      });
    }
  }

  CartItems.init(
    {
      cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Carts", key: "id" },
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Courses", key: "id" },
      },
      coursePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "CartItems",
      tableName: "CartItems",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["cartId", "courseId"],
        },
      ],
    }
  );

  return CartItems;
};
