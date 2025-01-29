const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const DownloadedFiles = sequelize.define('DownloadedFiles', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fileURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
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
  tableName: 'downloaded_files',
  timestamps: true,
});

DownloadedFiles.belongsTo(User, { foreignKey: 'userId' });

module.exports = DownloadedFiles;
