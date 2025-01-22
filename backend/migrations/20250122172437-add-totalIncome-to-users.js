'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('users', 'totalIncome', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    } catch (error) {
      console.error('Error adding totalIncome column to users:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('users', 'totalIncome');
    } catch (error) {
      console.error('Error removing totalIncome column from users:', error);
      throw error;
    }
  }
};