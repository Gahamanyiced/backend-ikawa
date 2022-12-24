import express from 'express';
import authControllers from '../controllers/auth.controller.js';
import {
  sendTokenToCookie,
  checkUserExist,
  protect,
} from '../middlewares/auth.middleware.js';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} from '../validations/auth.validation.js';

const router = express.Router();

router
  .route('/register')
  .post(
    registerValidation,
    checkUserExist,
    authControllers.registerUser,
    sendTokenToCookie
  );
router
  .route('/login')
  .post(loginValidation, authControllers.loginUser, sendTokenToCookie);
router.route('/me').get(protect,authControllers.getMe)
router
  .route('/forgotPassword')
  .post(forgotPasswordValidation, authControllers.forgotPassword);
router.route('/logout').get(authControllers.logout);
router
  .route('/resetPassword/:resettoken')
  .patch(resetPasswordValidation,authControllers.resetPassword, sendTokenToCookie);

export default router;
