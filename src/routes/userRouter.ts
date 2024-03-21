import express from 'express';
import userController from '../controller/userController';
import authController from '../controller/authController';
import { User } from '../models/User';
import upload from 'controller/uploadController/upload';
import uploadController from '../controller/uploadController';
import reviewController from '../controller/reviewController';

const router = express.Router();
router.route('/').get(userController.getAllUsers);

router.use(authController.protect);

router.get('/me/reviews', reviewController.getMyReviews, reviewController.getAllReviews);
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
router.route('/').post(userController.createUser);
// .get(userController.getAllUsers)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
