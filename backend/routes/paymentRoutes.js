const express = require('express');
const router = express.Router();
const { createOrder, verifySignature, updateOrderStatus } = require('../controller/paymentController');
const authenticateToken = require('../middleware');

router.post('/create-order', authenticateToken, createOrder);
router.post('/verify-signature', authenticateToken, verifySignature);
router.post('/update-status', authenticateToken, updateOrderStatus);

module.exports = router;
