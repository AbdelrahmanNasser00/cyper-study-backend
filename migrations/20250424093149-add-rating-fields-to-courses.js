"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Courses", "averageRating", {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.0,
    });

    await queryInterface.addColumn("Courses", "ratingCount", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Courses", "averageRating");
    await queryInterface.removeColumn("Courses", "ratingCount");
  },
};
