'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('users', 'isPremium', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
      await queryInterface.addColumn('users', 'totalExpenses', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    } catch (error) {
      console.error('Error adding columns to users:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('users', 'isPremium');
      await queryInterface.removeColumn('users', 'totalExpenses');
    } catch (error) {
      console.error('Error removing columns from users:', error);
      throw error;
    }
  }
};
