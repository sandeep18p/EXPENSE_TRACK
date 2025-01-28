const { Sequelize } = require('sequelize');
const Expense = require('../../models/Expense'); // Adjust path based on your structure

const getWeeklyReport = async (req, res) => {
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

    // Calculate the week number for each expense from the first expense date
    const firstExpenseDate = firstExpense.createdAt;

    const weeklyReport = await Expense.findAll({
      attributes: [
        [
          Sequelize.literal(`FLOOR(DATEDIFF(createdAt, '${firstExpenseDate.toISOString().split('T')[0]}') / 7) + 1`),
          'week',
        ], // Calculate the week number
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount'], // Sum of amounts per week
      ],
      where: { userId },
      group: ['week'],
      order: [['week', 'ASC']],
    });

    res.status(200).json({ success: true, data: weeklyReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch weekly report.' });
  }
};

module.exports = { getWeeklyReport };
