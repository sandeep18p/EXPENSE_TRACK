const express = require('express');
const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');
const router = express.Router();
const authenticateToken = require('../middleware');
const { where } = require('sequelize');
const jwt = require('jsonwebtoken');


const JWT_SECRET = 'your_secret_key';

const razorpay = new Razorpay({
  key_id: 'rzp_test_99MbpBrVmBdkbi',
  key_secret: 'O2vW4vkkvkaFiZnjSDhY1gBA',
});



// Create a payment order
router.post('/create-order', authenticateToken,  async (req, res) => {
  var currency = 'INR' 

  try {
    const options = {
      amount: 96 * 100, // Razorpay expects amount in paise
      currency
    };
    
    let order = await razorpay.orders.create(options);
    
   
    const newOrder = await Order.create({
      paymentID: order.id,
      orderID: order.id,
      status: "PENDING",
      userId: req.user.id
    });
    
    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating Razorpay order:", err); // Debugging line
    res.status(500).json({ message: 'Error creating Razorpay order', error: err.message });
  }
});

// Verify payment signature
router.post('/verify-signature', authenticateToken, (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generatedSignature = crypto.createHmac('sha256', razorpay.key_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    res.status(200).json({ message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid payment signature' });
  }
});

router.post('/update-status', authenticateToken, async (req, res) => {
  const { orderId, status, paymentId } = req.body;
   console.log(orderId, status, paymentId, "let's see")
  try {
    const order = await Order.findOne({ where: { orderID: orderId } });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.paymentID = paymentId;
    await order.save();
    if(order.status === 'SUCCESS'){
            const user = await User.findOne({where: {id: order.userId}})
            if (user) {
              user.isPremium = true;
              await user.save();
            }
            newToken = jwt.sign({ id: user.id, email: user.email, isPremium: user.isPremium }, JWT_SECRET, { expiresIn: '1h' });
           
            console.log(newToken)
            res.status(200).setHeader('Authorization', `Bearer ${newToken}`).json({ message: 'Order status updated successfully'}); }
  } catch (err) {
    console.error("Error updating order status:", err); // Debugging line
    res.status(500).json({ message: 'Error updating order status', error: err.message });
  }
});
module.exports = router;
