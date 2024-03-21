import authController from '../controller/authController';
import reviewController from '../controller/reviewController';
import { Router } from 'express';

const router = Router();

// router.get('/me/user', authController.protect, reviewController.getMyReviews);
// router.get('/me/worker', authController.protect, reviewController.getMyWorkerReviews, reviewController.getAllReviews);

router.get('/:id', reviewController.getReviewById);

router.use(authController.protect);

router.post(
  '/:id', //here it is application id!!!
  authController.restrictTo('User'),
  reviewController.ValidateReviewInputs,
  reviewController.createReview
);

router.patch('/:id', reviewController.checkOwnerReview, reviewController.updateReview);


router.delete(
  '/:id',
  reviewController.checkOwnerReview,
  reviewController.deleteReviewById
);

router.get('/', reviewController.getAllReviews)

export default router;
