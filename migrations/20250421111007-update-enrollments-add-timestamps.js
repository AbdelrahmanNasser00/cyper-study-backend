"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      // Remove enrolledAt column
      queryInterface.removeColumn("Enrollments", "enrolledAt"),

      // Add timestamps
      queryInterface.addColumn("Enrollments", "createdAt", {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }),
      queryInterface.addColumn("Enrollments", "updatedAt", {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn("Enrollments", "enrolledAt", {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }),
      queryInterface.removeColumn("Enrollments", "createdAt"),
      queryInterface.removeColumn("Enrollments", "updatedAt"),
    ]);
  },
};
