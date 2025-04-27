'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Progresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // اسم جدول اليوزرز
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Courses', // اسم جدول الكورسات
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      lessonId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Lessons', // اسم جدول الدروس
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      isCompleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Progresses');
  }
};
