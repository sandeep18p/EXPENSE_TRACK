const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware');
const {
  getExpenses,
  addExpense,
  deleteExpense,
  getTotalExpenses,
  editExpense
} = require('../controller/expenseController');

router.get('/', authenticateToken, getExpenses);
router.post('/', authenticateToken, addExpense);
router.put('/editExpense', authenticateToken, editExpense);
router.delete('/:id', authenticateToken, deleteExpense);
router.get('/total-expenses', authenticateToken, getTotalExpenses);

module.exports = router;
