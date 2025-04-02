"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Lessons", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Courses", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: { type: Sequelize.STRING, allowNull: false },
      videoUrl: { type: Sequelize.STRING },
      content: { type: Sequelize.TEXT },
      order: { type: Sequelize.INTEGER, allowNull: false },
      duration: { type: Sequelize.INTEGER },
      isPreview: { type: Sequelize.BOOLEAN, defaultValue: false },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Lessons");
  },
};
