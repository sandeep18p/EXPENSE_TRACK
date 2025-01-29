const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoute');
const paymentRoutes = require('./routes/paymentRoutes');
const resetPasswordRoutes = require('./routes/resetPasswordRoutes');
const  reportRoutes = require('./routes/report');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();

const PORT = 3000;
app.use(cookieParser());
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Auth-Token'],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Expose-Headers', 'Authorization');
  next();
});

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Routes
app.use('/user', userRoutes);  //for login and signup
app.use('/expenses', expenseRoutes);  //for expenses add,delete,edit
app.use('/user/reset', resetPasswordRoutes); //for reseting password

app.use('/expenses/paymentOrder1', paymentRoutes); //for payment via rajorpay
app.use('/api/reports', reportRoutes);

// Sync Sequelize models and start server
(async () => {
  try {
    await sequelize.sync(); // Sync models with the database
    console.log('Database synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
})();
