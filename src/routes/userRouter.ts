import express from 'express';
import userController from '../controller/userController';
import authController from '../controller/authController';
import { User } from '../models/User';
import upload from 'controller/uploadController/upload';
import uploadController from '../controller/uploadController';

const router = express.Router();

router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/editMe',
  authController.restrictTo('User'),
  uploadController.upload.single('profilePicture'),
  uploadController.uploadProfilePicture,
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
