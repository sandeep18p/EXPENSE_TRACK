const express = require('express');
const { getDailyReport, getWeeklyReport, getMonthlyReport, getDownloadFromS3, getDownloadedFiles} = require('../../controller/reportController');
const authenticate = require('../../middleware'); // Middleware to authenticate user

const router = express.Router();


router.get('/daily', authenticate, getDailyReport);


router.get('/weekly', authenticate, getWeeklyReport);


router.get('/monthly', authenticate, getMonthlyReport);

router.get('/download', authenticate, getDownloadFromS3);
router.get('/downloaded-files', authenticate, getDownloadedFiles);


module.exports = router;
