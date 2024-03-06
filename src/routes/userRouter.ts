import express from 'express';
import userController from '../controller/userController/userController';
import authController from '../controller/authController/authController';
import { User } from '../models/User';

const router = express.Router();

router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/editMe',
  authController.restrictTo('User'),
  userController.uploadProfilePicture,
  userController.editMe(User)
);

// router.use(restrictTo('admin')); //TODO add later
// CRUD :
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
