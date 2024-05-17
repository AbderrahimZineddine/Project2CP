import express from 'express';
import userController from '../controller/userController';
import authController from '../controller/authController';
import { User } from '../models/User';
import uploadController from '../controller/uploadController';
import reviewController from '../controller/reviewController';
import postController from '../controller/postController';
import dealController from '../controller/dealController';
import workerController from '../controller/workerController';
import { notificationController } from '../models/Notification';

const router = express.Router();
router.route('/').get(userController.getAllUsers);

router.route('/map').get(userController.getMap);

// router.use(authController.protect);

router.get(
  '/me/reviews',
  authController.protect,
  reviewController.getMyReviews,
  reviewController.getAllReviews
);

router.get(
  '/me/notifications',
  authController.protect,
  notificationController.getMyNotificationsById,
  notificationController.getAllNotifications
);

router.get(
  '/me/notificationsCount',
  authController.protect,
  notificationController.getMyNotificationsById,
  notificationController.newNotificationsCount
);

// router.get(
//   '/me/posts',
//   authController.protect,
//   postController.getMyPosts,
//   postController.getAllPosts
// );

router.get(
  '/me/favoriteWorkers',
  authController.protect,
  userController.getFavoriteWorkers,
  workerController.getAllWorkers
);

router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);

router.patch(
  '/editMe',
  authController.protect,
  authController.restrictTo('User'),
  uploadController.upload.single('profilePicture'),
  uploadController.uploadProfilePicture,
  userController.editMe(User)
);

// router.use(restrictTo('admin')); //TODO add later
// CRUD :
router.route('/').post(userController.createUser);
// .get(userController.getAllUsers)

router.get('/:id/favoriteWorkers', userController.getFavoriteWorkersFromUserId);

router.get(
  '/:id/notifications',
  notificationController.getUserNotificationsById,
  notificationController.getAllNotifications
);

router.get(
  '/:id/notificationsCount',
  notificationController.getUserNotificationsById,
  notificationController.newNotificationsCount
);

router.get(
  '/:id/posts',
  postController.getPostsFromUserById,
  postController.getAllPosts
);

router.get(
  '/:id/deals',
  dealController.getDealsFromUserById,
  dealController.showDeletedMiddleware,
  dealController.sortMiddleware,
  dealController.getAllDeals
);

router.get(
  '/:id/reviews',
  reviewController.getReviewsFromUserById,
  reviewController.getAllReviews
);

//restrictLater
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
