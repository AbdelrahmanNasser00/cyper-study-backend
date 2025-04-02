"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Certificate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Certificate.belongsTo(models.User, { foreignKey: "userId" });
      Certificate.belongsTo(models.Course, { foreignKey: "courseId" });
    }
  }
  Certificate.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      courseId: { type: DataTypes.INTEGER, allowNull: false },
      certificateCode: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      issuedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      pdfUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Certificate",
      tableName: "Certificates",
      timestamps: false,
    }
  );
  return Certificate;
};
