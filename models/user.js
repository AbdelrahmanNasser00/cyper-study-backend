"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Cart, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Course, { foreignKey: "instructorId" });
      User.hasMany(models.Order, { foreignKey: "userId" });
      User.hasMany(models.Notification, { foreignKey: "userId" });
      User.hasMany(models.Payment, { foreignKey: "userId" });
      // User.hasMany(models.Review, {
      //   foreignKey: "userId",
      //   onDelete: "CASCADE",
      // });
      User.belongsToMany(models.Course, {
        through: models.Enrollment,
        foreignKey: "userId",
      });
      User.belongsToMany(models.Course, {
        through: models.Wishlist,
        foreignKey: "userId",
        otherKey: "courseId",
      });
      User.belongsToMany(models.Course, {
        through: models.Review,
        foreignKey: "userId",
      });

      User.belongsToMany(models.Course, {
        through: models.Certificate,
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      firstname: { type: DataTypes.STRING, allowNull: false },
      lastname: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM("student", "instructor", "admin"),
        defaultValue: "student",
      },
      bio: DataTypes.TEXT,
      profilePicture: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
    }
  );
  return User;
};
