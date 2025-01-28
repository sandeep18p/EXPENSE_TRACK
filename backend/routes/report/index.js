const express = require('express');
const { getDailyReport, getWeeklyReport, getMonthlyReport } = require('../../controller/reportController');
const authenticate = require('../../middleware'); // Middleware to authenticate user

const router = express.Router();


router.get('/daily', authenticate, getDailyReport);


router.get('/weekly', authenticate, getWeeklyReport);


router.get('/monthly', authenticate, getMonthlyReport);

module.exports = router;
