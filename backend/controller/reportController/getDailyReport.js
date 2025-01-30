const Expense = require('../../models/expense'); // Adjust path as necessary

const getDailyReport = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the request

    // Fetch all expense details for the user
    const expenses = await Expense.findAll({
      where: { userId },
      order: [['createdAt', 'ASC']], // Sort by date
    });

    // Format the data
    const report = expenses.map((expense) => ({
      date: expense.createdAt.toISOString().split('T')[0], // Format the date
      description: expense.description,
      category: expense.category,
      income: expense.amount > 0 ? expense.amount.toFixed(2) : '0.00', // Income
      expense: expense.amount < 0 ? Math.abs(expense.amount).toFixed(2) : '0.00', // Expense
    }));

    // Send the formatted data as JSON
    if(req.s3==true){
      return report;
    }
   return res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch daily report.' });
  }
};

module.exports = { getDailyReport };
