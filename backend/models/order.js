const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as necessary
const User = require('./user'); // Ensure the correct path to the User model

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  paymentID: {
    type: DataTypes.STRING,
  },
  orderID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Use the table name directly to avoid circular dependency
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'orders',
  timestamps: false,
});

module.exports = Order;