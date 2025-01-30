const { Sequelize } = require('sequelize');// Adjust the path as per your project structure
const { getDailyReport } = require('./getDailyReport');
const DownloadedFiles = require('../../models/downloadedFiles');
const S3services = require('../../services/S3services');
const getDownloadFromS3 = async (req, res) => {
    try {
        req.s3 = true;
        const expenses = await getDailyReport(req, res); 
        const stringifiedExpenses = JSON.stringify(expenses);

        const userId = req.user.id;
        const filename = `Expense${userId}/${new Date().toISOString()}.txt`;
        const fileURL = await S3services.uploadToS3(stringifiedExpenses, filename);
        //    console.log("fanny ",fileUrl)
        await DownloadedFiles.create({ userId, fileURL });
       return res.status(200).json({ fileURL, success: true });
    } catch (error) { 
        console.error('Error getting expenses:', error);
        }
};

module.exports = { getDownloadFromS3 };
