import authController from '../controller/authController';
import uploadController from '../controller/uploadController';
import portfolioPostsController from '../controller/workerController/portfolioPostsController';
import { Router } from 'express';

const router = Router();

router.get('/:id', portfolioPostsController.getPortfolioPostById);

router.use(authController.protect);
router.use(authController.restrictTo('Worker'));

router.post(
  '/',
  uploadController.upload.array('images'),
  uploadController.uploadImages,
  portfolioPostsController.createPortfolioPost
);
router.patch('/:id/like', portfolioPostsController.toggleLikePortfolioPost);
router.patch(
  '/:id',
  portfolioPostsController.checkOwnerPortfolioPost,
  uploadController.upload.array('images'),
  uploadController.uploadImages,
  portfolioPostsController.updatePortfolioPost
);
router.delete(
  '/:id',
  portfolioPostsController.checkOwnerPortfolioPost,
  portfolioPostsController.deletePortfolioPostById
);

export default router;
