const express = require('express');
const router = express.Router();
const {
  forgotPassword,
  resetPasswordForm,
  updatePassword
} = require('../controller/passwordController');

router.post('/password/forgotpassword', forgotPassword);
router.get('/password/resetpassword/:id', resetPasswordForm);
router.post('/password/updatepassword/:id', updatePassword);

module.exports = router;
