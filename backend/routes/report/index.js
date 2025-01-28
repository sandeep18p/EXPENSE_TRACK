const express = require('express');
const { getDailyReport, getWeeklyReport, getMonthlyReport } = require('../../controller/reportController');
const authenticate = require('../../middleware'); // Middleware to authenticate user

const router = express.Router();

// Route for daily report
router.get('/daily', authenticate, getDailyReport);

// Route for weekly report
router.get('/weekly', authenticate, getWeeklyReport);

// Route for monthly report
router.get('/monthly', authenticate, getMonthlyReport);

module.exports = router;
