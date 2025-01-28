const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const ForgetPasswordRequests = require('../../models/forgotPasswordRequests');
const User = require('../../models/user');
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

const apiKey = Sib.ApiClient.instance.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

const apiInstance = new Sib.TransactionalEmailsApi();
const sender = { email: 'sandeep.pansari98x@gmail.com' };

const forgotPassword = async (req, res) => {
  const { email } = req.body;
 
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const requestId = uuidv4();
    await ForgetPasswordRequests.create({
      id: requestId,
      userId: user.id,
      isActive: true
    });
    //console.log("gogp", apiKey.apiKey)
    const resetUrl = `http://localhost:3000/user/reset/password/resetpassword/${requestId}`;
    const receiver = [{ email: user.email }];

    await apiInstance.sendTransacEmail({
      sender,
      to: receiver,
      subject: 'Password Reset Request',
      textContent: 'and easy to do anywhere, even with Node.js',
      htmlContent: `<a href="${resetUrl}">Reset password</a>`
    });

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const resetPasswordForm = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await ForgetPasswordRequests.findOne({ where: { id, isActive: true } });
    if (!request) {
      return res.status(404).json({ error: 'Invalid or expired password reset request' });
    }

    await request.update({ isActive: false });

    res.status(200).send(`<html>
                            <form action="/user/reset/password/updatepassword/${id}" method="POST">
                                <label for="newpassword">Enter New password</label>
                                <input name="newpassword" type="password" required></input>
                                <button>reset password</button>
                            </form>
                          </html>`);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { newpassword } = req.body;

  try {
    const request = await ForgetPasswordRequests.findOne({ where: { id } });
    if (!request) {
      return res.status(404).json({ error: 'Invalid password reset request' });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: request.userId } });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  forgotPassword,
  resetPasswordForm,
  updatePassword
};
