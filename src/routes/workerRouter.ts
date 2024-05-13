import express from 'express';
import workerController from '../controller/workerController';
import authController from '../controller/authController';
import userController from '../controller/userController';
import { Worker } from '../models/Worker';
import uploadController from '../controller/uploadController';
import reviewController from '../controller/reviewController';
import dealController from '../controller/dealController';
import portfolioPostsController from '../controller/workerController/portfolioPostsController';

export const router = express.Router();

router.get(
  '/me/reviews',
  authController.protect,
  authController.restrictTo('Worker'),
  reviewController.getMyWorkerReviews,
  reviewController.getAllReviews
);

router.get(
  '/me/portfolioPosts',
  authController.protect,
  authController.restrictTo('Worker'),
  portfolioPostsController.getMyPortfolioPosts
);

router.get(
  '/me/requests',
  authController.protect,
  authController.restrictTo('Worker'),
  workerController.getMyRequests
);
router.delete(
  '/me/requests/:id',
  authController.protect,
  authController.restrictTo('Worker'),
  workerController.deleteRequestById
);

router.get(
  '/me',
  authController.protect,
  authController.restrictTo('Worker'),
  userController.getMe,
  workerController.getWorkerById
);


router.get(
  '/:id/reviews',
  reviewController.getWorkerReviews,
  reviewController.getAllReviews
);
router.get(
  '/:id/portfolioPosts',
  authController.isLoggedIn,
  portfolioPostsController.getPortfolioPostsFromWorkerById
);
router.get(
  '/:id/savedPosts',
  // authController.protect,
  // authController.restrictTo('Worker'),
  workerController.getWorkerSavedPostsById
);
router.get('/:id/certificates', workerController.getWorkerCertificatesById);
router.get(
  '/:id/deals',
  // authController.protect,
  dealController.getDealsFromWorkerById,
  dealController.showDeletedMiddleware,
  dealController.sortMiddleware,
  dealController.getAllDeals
);

router.patch(
  '/:id/favorite',
  authController.protect,
  userController.ToggleFavoriteWorker
);

router.get(
  '/:id',
  // authController.protect,
  // authController.restrictTo('User'),
  authController.isLoggedIn,
  workerController.getWorkerById
);
//! don't repeat that mistake !!!!!!!!!!!!!!!!!!!!!!!!!!!!! ( route(:id)) other routes after are like id ( ex : me ) )

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('User', 'Admin'),
    workerController.getAllWorkers
  );

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
