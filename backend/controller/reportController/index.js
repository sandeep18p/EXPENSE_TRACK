const { getDailyReport } = require('./getDailyReport');
const { getWeeklyReport } = require('./getWeeklyReport');
const { getMonthlyReport } = require('./getMonthlyReport');
const { getDownloadFromS3 } = require('./getDownloadFromS3');
const {  getDownloadedFiles } = require('./getDownloadedFiles');

module.exports = { getDailyReport, getWeeklyReport, getMonthlyReport, getDownloadFromS3,  getDownloadedFiles };
