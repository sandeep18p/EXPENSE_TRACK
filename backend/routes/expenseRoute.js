const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Expense = require('../models/expense');
const User = require('../models/user');
const authenticateToken = require('../middleware')
const { Sequelize } = require('sequelize');
const  sequelize  = require('../config/database');

router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log("User ID from token: APDHII", req.user.id); // Debugging line
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    console.log("Expenses fetched:", expenses); // Debugging line
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err); // Debugging line
    res.status(500).json({ message: 'Error fetching expenses', error: err.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const { amount, description, category } = req.body;
  const t = await sequelize.transaction();
  try {
    const expense = await Expense.create({
      userId: req.user.id,
      amount,
      description,
      category,
    },{ transaction: t});
    await User.update({ totalExpenses: Sequelize.literal(`totalExpenses + ${amount}`) }, { where: { id: req.user.id }, transaction: t });
    await t.commit();
    res.status(201).json(expense);
  } catch (err) {
    await t.rollback();
    console.error("Error adding expense:", err); // Debugging line
    res.status(500).json({ message: 'Error adding expense', error: err.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
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
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/total-expenses', authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['name', 'totalExpenses'],
      order: [['totalExpenses', 'DESC']]
    });
   

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users with total expenses:', error);
    res.status(500).json({ message: 'Error fetching users with total expenses', error: error.message });
  }
});


module.exports = router;
