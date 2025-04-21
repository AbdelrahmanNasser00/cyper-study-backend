"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("Carts", "Cart");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("Cart", "Carts");
  },
};
