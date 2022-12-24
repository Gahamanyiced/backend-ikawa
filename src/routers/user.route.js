import express from 'express';
import userController from '../controllers/user.controller.js';
import { getUserById } from '../middlewares/user.middleware.js';
import { protect, authorize } from '..//middlewares/auth.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('user'), userController.getAllUsers)
  .post(protect, authorize('user'), userController.createUser);
router
  .route('/:id')
  .get(protect, authorize('user'), getUserById, userController.getUser)
  .patch(
    protect,
    authorize('user'),
    getUserById,
    userController.updateUser
  )
  .delete(
    protect,
    authorize('user'),
    getUserById,
    userController.deleteUser
  );
router
  .route('/:id/photo')
  .patch(
    protect,
    authorize('user'),
    getUserById,
    userController.userPhotoUpload
  );

export default router;