const Razorpay = require('razorpay');
const Order = require('../../models/order');
const User = require('../../models/user');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const JWT_SECRET = process.env.SECRET_KEY;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZOR_PAY_SECRET,
});

const createOrder = async (req, res) => {
  const currency = 'INR';

  try {
    const options = {
      amount: 96 * 100,
      currency,
    };

    let order = await razorpay.orders.create(options);

    const newOrder = await Order.create({
      paymentID: order.id,
      orderID: order.id,
      status: 'PENDING',
      userId: req.user.id,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error creating Razorpay order', error: err.message });
  }
};

const verifySignature = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generatedSignature = crypto.createHmac('sha256', razorpay.key_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    res.status(200).json({ message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid payment signature' });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId, status, paymentId } = req.body;

  try {
    const order = await Order.findOne({ where: { orderID: orderId } });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.paymentID = paymentId;
    await order.save();

    if (order.status === 'SUCCESS') {
      const user = await User.findOne({ where: { id: order.userId } });
      if (user) {
        user.isPremium = true;
        await user.save();
      }
      const newToken = jwt.sign(
        { id: user.id, email: user.email, isPremium: user.isPremium },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).setHeader('Authorization', `Bearer ${newToken}`).json({ message: 'Order status updated successfully' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status', error: err.message });
  }
};

module.exports = {
  createOrder,
  verifySignature,
  updateOrderStatus,
};
