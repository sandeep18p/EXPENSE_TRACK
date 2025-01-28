const { Sequelize } = require('sequelize');
const Expense = require('../../models/expense');
const User = require('../../models/user');
const sequelize = require('../../config/database');

const getExpenses = async (req, res) => {
  try {

    console.log("hj")
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const totalCount = await Expense.count({ where: { userId: req.user.id } });
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(totalCount / limit);
    
    res.json({
      expenses: expenses,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expenses', error: err.message });
  }
};

const addExpense = async (req, res) => {
  const { amount, description, category } = req.body;
  const t = await sequelize.transaction();
  try {
    const expense = await Expense.create({
      userId: req.user.id,
      amount,
      description,
      category,
    }, { transaction: t });

    await User.update({ totalExpenses: Sequelize.literal(`totalExpenses + ${amount}`) }, { where: { id: req.user.id }, transaction: t });
    await t.commit();
    
    res.status(201).json(expense);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: 'Error adding expense', error: err.message });
  }
};

const deleteExpense = async (req, res) => {
  const expenseId = req.params.id;
  const t = await sequelize.transaction();
  
  try {
    const expense = await Expense.findOne({ where: { id: expenseId }, transaction: t });
    if (!expense) {
      await t.rollback();
      return res.status(404).json({ error: 'Expense not found' });
    }

    await Expense.destroy({ where: { id: expenseId }, transaction: t });
    await User.update(
      { totalExpenses: Sequelize.literal(`totalExpenses - ${expense.amount}`) },
      { where: { id: req.user.id }, transaction: t }
    );

    await t.commit();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTotalExpenses = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['name', 'totalExpenses'],
      order: [['totalExpenses', 'DESC']]
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users with total expenses', error: error.message });
  }
};

module.exports = {
  getExpenses,
  addExpense,
  deleteExpense,
  getTotalExpenses,
};
