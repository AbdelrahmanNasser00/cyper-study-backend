"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Coupons", "instructorId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Users", 
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Coupons", "instructorId");
  }
};
