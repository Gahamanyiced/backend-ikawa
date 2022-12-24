import { registerUser } from '../services/auth.service.js';
import User from '../database/models/User.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
export class authControllers {
  async registerUser(req, res, next) {
    try {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      };
      const user = await registerUser(newUser);
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({
        message: 'Unable to register, try again',
        error: error.message,
      });
    }
  }
  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      //check for user
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          message: 'Invalid credentials',
        });
      }

      //check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          message: 'Invalid credentials',
        });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({
        message: 'Error while login',
        error: error.message,
      });
    }
  }
  async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      res.status(200).json({
        user,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error while getting a user',
        error: error.message,
      });
    }
  }
  async forgotPassword(req, res, next) {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'There is no user with that email',
      });
    }
    //Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    //create reset url
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/resetPassword/${resetToken}`;

    const message = `You requested to reset password.Please make a PATCH request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });

      res.status(200).json({ message: 'Email sent' });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        message: 'Email could not be sent',
        error: err.message,
      });
    }
    // res.status(200).json({
    //   user,
    // });
  }
  async resetPassword(req, res, next) {
    //Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordExpire: { $gt: Date.now() },
      resetPasswordToken,
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid token',
      });
    }

    //Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    req.user = user;
    next();
  }
  async logout(req, res) {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
    });
    res.status(200).json({
      message: 'Logout successfully',
    });
  }
}
const authController = new authControllers();
export default authController;
