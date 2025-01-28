const { Sequelize } = require('sequelize');
require('dotenv').config();
const dbUName = process.env.DB_USER_NAME;
const dbPassword = process.env.DB_PASSWORD;
const sequelize = new Sequelize('expense', dbUName, dbPassword, {
  host: 'localhost',
  dialect: 'mysql',
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
