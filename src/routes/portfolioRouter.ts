import authController from '../controller/authController';
import uploadController from '../controller/uploadController';
import portfolioPostsController from '../controller/workerController/portfolioPostsController';
import { Router } from 'express';

const router = Router();

router.get(
  '/:id',
  authController.isLoggedIn,
  portfolioPostsController.getPortfolioPostById
);

// router.use(authController.protect);
// router.use(authController.restrictTo('Worker'));

router.post(
  '/',
  authController.protect,
  authController.restrictTo('Worker'),
  uploadController.upload.array('images'),
  uploadController.uploadImages,
  portfolioPostsController.createPortfolioPost
);

router.get('/', portfolioPostsController.getAllPortfolioPosts);

router.patch(
  '/:id/like',
  authController.protect,
  authController.restrictTo('User'),
  portfolioPostsController.toggleLikePortfolioPost
);
router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('Worker'),
  portfolioPostsController.checkOwnerPortfolioPost,
  uploadController.upload.array('images'),
  uploadController.uploadImages,
  portfolioPostsController.updatePortfolioPost
);
router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('Worker'),
  portfolioPostsController.checkOwnerPortfolioPost,
  portfolioPostsController.deletePortfolioPostById
);

export default router;
