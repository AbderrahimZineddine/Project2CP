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
  userController.resizeProfilePicture,
  userController.editMeUser(User)
);

// router.use(restrictTo('admin')); //TODO add later
// CRUD :
router
  .route('/')
  .get(authController.restrictTo('admin'), userController.getAllUsers)
  .post(authController.restrictTo('admin'), userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(authController.restrictTo('admin'), userController.updateUser)
  .delete(authController.restrictTo('admin'), userController.deleteUser);

export default router;
