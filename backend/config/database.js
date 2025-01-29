const { Sequelize } = require('sequelize');
require('dotenv').config();
const dbUName = process.env.DB_USER_NAME;
const dbPassword = process.env.DB_PASSWORD;
const dbNAME = process.env.DB_NAME;
const dbHOST = process.env.DB_HOST;
const sequelize = new Sequelize(dbNAME, dbUName, dbPassword, {
  host: dbHOST,
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
