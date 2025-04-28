"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Certificates", "pdfUrl");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Certificates", "pdfUrl", {
      type: Sequelize.STRING,
    });
  },
};
