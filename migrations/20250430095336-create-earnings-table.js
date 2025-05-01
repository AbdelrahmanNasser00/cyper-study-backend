"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Earnings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      instructorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", 
          key: "id",
        },
        onDelete: "CASCADE",
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Courses", 
          key: "id",
        },
        onDelete: "CASCADE",
      },
      totalEarnings: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Earnings");
  },
};