const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as necessary
const Expense = require('./expense'); // Adjust the path as necessary
const Order = require('./order');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Unnamed User', // Set a default value for the name field
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPremium: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Set default value to false
  },
  totalExpenses: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Set default value to 0
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
  tableName: 'users',
  timestamps: false,
});

User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });


User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// User.hasMany(Order, { foreignKey: 'userId' });
module.exports = User;
