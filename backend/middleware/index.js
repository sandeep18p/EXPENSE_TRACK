const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.SECRET_KEY;
// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token); // Debugging line

  if (!token) {
    console.log('Token not found'); // Debugging line
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err); // Debugging line
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;