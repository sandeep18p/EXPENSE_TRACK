const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const { v4: uuidv4 } = require('uuid');

const ForgotPasswordRequests = sequelize.define('ForgotPasswordRequests', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
    tableName: 'forgots',
  timestamps: true
});

User.hasMany(ForgotPasswordRequests, { foreignKey: 'userId' });
ForgotPasswordRequests.belongsTo(User, { foreignKey: 'userId' });

module.exports = ForgotPasswordRequests;