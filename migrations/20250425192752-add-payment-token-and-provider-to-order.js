module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'paymentToken', {
      type: Sequelize.STRING,
      allowNull: true, // يمكنك تحديد ما إذا كان يمكن أن يكون null أو لا
    });
    await queryInterface.addColumn('Orders', 'provider', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'paymentToken');
    await queryInterface.removeColumn('Orders', 'provider');
  }
};
