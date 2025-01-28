const { Sequelize } = require('sequelize');
const Expense = require('../../models/Expense'); // Adjust the path as per your project structure

const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the first expense date for the user
    const firstExpense = await Expense.findOne({
      where: { userId },
      order: [['createdAt', 'ASC']],
      attributes: ['createdAt'],
    });

    if (!firstExpense) {
      return res.status(404).json({ success: false, message: 'No expenses found for the user.' });
    }

    // Calculate the month for each expense from the first expense date
    const firstExpenseDate = firstExpense.createdAt;

    const monthlyReport = await Expense.findAll({
      attributes: [
        [
          Sequelize.literal(`DATE_FORMAT(createdAt, '%Y-%m')`), // Format the date as 'YYYY-MM'
          'month',
        ], // Calculate the month
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount'], // Sum of amounts per month
      ],
      where: { userId },
      group: ['month'],
      order: [['month', 'ASC']], // Order by month
    });

    res.status(200).json({ success: true, data: monthlyReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch monthly report.' });
  }
};

module.exports = { getMonthlyReport };
