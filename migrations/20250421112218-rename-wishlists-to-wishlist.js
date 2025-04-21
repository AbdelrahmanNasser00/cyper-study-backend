"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("Wishlists", "Wishlist");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable("Wishlist", "Wishlists");
  },
};
