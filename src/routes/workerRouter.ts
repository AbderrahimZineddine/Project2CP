import express from 'express';
import workerController from '../controller/workerController';
import authController from '../controller/authController';
import userController from '../controller/userController';
import { Worker } from '../models/Worker';
import uploadController from '../controller/uploadController';
import reviewController from '../controller/reviewController';

export const router = express.Router();

router.get(
  '/me/reviews',
  authController.protect,
  authController.restrictTo('Worker'),
  reviewController.getMyWorkerReviews,
  reviewController.getAllReviews
);

router.get(
  '/me',
  authController.protect,
  authController.restrictTo('Worker'),
  userController.getMe,
  workerController.getWorkerById
);

router.route('/').get(workerController.getAllWorkers);
router.get('/:id/reviews', reviewController.getWorkerReviews, reviewController.getAllReviews);

router.patch(
  '/:id/favorite',
  authController.protect,
  userController.ToggleFavoriteWorker
);

router.get('/:id', authController.isLoggedIn, workerController.getWorkerById);
//! don't repeat that mistake !!!!!!!!!!!!!!!!!!!!!!!!!!!!! ( route(:id)) other routes after are like id ( ex : me ) )

router.use(authController.protect);

router.use(authController.restrictTo('Worker'));

router.patch(
  '/editMe',
  // userController.upload.single('profilePicture'),
  uploadController.upload.single('profilePicture'),
  uploadController.uploadProfilePicture,
  // userController.upload.array('certificates'),
  // uploadController.uploadCertificates,
  workerController.editMeWorker,
  userController.editMe(Worker)
);

// router.use(restrictTo('admin')); //TODO add later
// CRUD :
router.route('/').post(workerController.createWorker);

router
  .route('/:id') //! don't repeat that mistake !!!!!!!!!!!!!!!!!!!!!!!!!!!!! ( route(:id)) other routes after are like id ( ex : me ) )
  .patch(workerController.updateWorker)
  .delete(workerController.deleteWorker);

export default router;
